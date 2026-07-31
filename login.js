$(function () {


    $("#login-dialog").dialog({
        autoOpen: false, // 自動では開かない
        modal: true, // 背景をグレーアウトしてモーダル表示
        width: 'auto', //横幅のサイズを設定
        resizable: false, //　サイズ変更を無効化
        draggable: false, //　ドラッグによる移動を無効化


        //2026/6/20 追加予定
        //enterキーを押した時=ログインを押した時の処理
        open: function () {
            console.log("open");
            $(this).on({
                "keypress": function (e) {
                    console.log("keypress:" + e.keyCode);
                    if (e.keyCode == 13) {//keyCode 13 = enter
                        console.log("if");
                        //submitを作動させないように
                        e.preventDefault();
                        //プログラムからログインボタンeq(0)を押す
                        $('.ui-dialog-buttonpane button:eq(0)').click();
                    }
                }
            });
        },

        buttons: {
            "ログイン": function () {

                console.log("login");

                const password = $("#login-password").val();

                if (!password) {
                    $("#login-error").text("パスワードを入力してください。").show();
                    return;
                }

                // サーバー(Python)へ送信
                $.ajax({
                    type: "POST",
                    url: "/cgi-bin/login.py",
                    data: { password: password },
                    dataType: "json",
                    success: function (response) {
                        console.log("ajax");
                        if (response.status === "success") {
                            if (response.username) {
                                sessionStorage.setItem("username", response.username);
                            }
                            window.location.href = "NotificationP.html";
                        } else {
                            $("#login-error").text(response.message).show();
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error("AJAX Error:", error);
                        $("#login-error").text("サーバーエラーが発生しました。").show();
                    }
                });
            },
            "キャンセル": function () {
                $(this).dialog("close");
            }
        }
    });

    // 宛先隣のボタンからダイアログを開く
    $("#recipient-login-btn").on("click", function () {
        $("#login-error").hide();
        $("#login-password").val("");
        $("#login-dialog").dialog("open");
    });
});


