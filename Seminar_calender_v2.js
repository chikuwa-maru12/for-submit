var calendarEl = document.getElementById('calendar');
var now = new Date();
var Year = now.getFullYear();
var Month = now.getMonth() + 1;
var date = ("0" + now.getDate()).slice(-2);
var today = Year + '-' + Month + '-' + date;
var today_student = []
//console.log(today);
/* フリックコードの始まり*/
$(document).ready(function () {
    /** ①初期メッセージ出力 */
    //$("#msg").text("スマホで下の枠を指でスワイプしてください");

    /** ②指が触れたか検知 */
    $("#calendar").on("touchstart", start_check);

    /** ③指が動いたか検知 */
    $("#calendar").on("touchmove", move_check);

    /** ④指が離れたか検知 */
    $("#calendar").on("touchend", end_check);

    /** 変数宣言 */
    var moveY, modeX, posiY, posiX;


    // ⑤タッチ開始時の処理
    function start_check(event) {
        /** 現在の座標取得 */
        posiY = getY(event);
        posiX = getX(event);

        /** 移動距離状態を初期化 */
        moveY = '';
        moveX = '';

        /** 表示メッセージを初期化 */
        msgY = '';
        msgX = '';
    }

    // ⑥スワイプ中の処理
    function move_check(event) {
        if (posiX - getX(event) > 70) // 70px以上移動でスワイプと判断
        {
            /** 右→左と判断 */
            moveX = "left";
        } else if (posiX - getX(event) < -70) // 70px以上移動でスワイプと判断
        {
            /** 左→右と判断 */
            moveX = "right";
        }

        if (posiY - getY(event) > 70) // 70px以上移動でスワイプと判断
        {
            /** 下→上と判断 */
            moveY = "top";
        } else if (posiY - getY(event) < -70) // 70px以上移動でスワイプと判断
        {
            /** 上→下と判断 */
            moveY = "bottom";
        }
    }

    // ⑦指が離れた時の処理
    function end_check(event) {
        if (moveX == "left") {
            msgX = "左へ移動";
            $('.fc-next-button').click();

        } else if (moveX == "right") {
            msgX = "右へ移動";
            $('.fc-prev-button').click();
        } else {
            msgX = "移動なし";
        }


        if (moveY == "top") {
            msgY = "上へ移動";
        } else if (moveY == "bottom") {
            msgY = "下へ移動";
        } else {
            msgY = "移動なし";
        }
    }


    // 座標取得処理
    function getY(event) {
        //縦方向の座標を取得
        return (event.originalEvent.touches[0].pageY);
    }

    function getX(event) {
        //横方向の座標を取得
        return (event.originalEvent.touches[0].pageX);
    }
});
/* フリックコードの終わり*/

// ダイアログの初期設定
$("#mydialog2").dialog({
    autoOpen: false, // 自動的に開かないように設定
    width: 'auto', // 横幅のサイズを設定
    modal: true, // モーダルダイアログにする
    title: '【Seminar 登録】',
});
$("#mydialog").dialog({
    autoOpen: false, // 自動的に開かないように設定
    width: 'auto', // 横幅のサイズを設定
    modal: true, // モーダルダイアログにする
    title: '【指導時間帯】',//2026-4-18 Seminar 出席確認から変更
});

//fullcalenderの設定
var calendar = new FullCalendar.Calendar(calendarEl, {
    views: {
        timeGridWeek: {
            duration: { days: 4 },
            buttonText: '週',
        },
    },
    //カレンダーの駒
    eventDidMount: function (arg) {
        var dotCOLOR = arg.event.extendedProps.description['実施方式'] == '対面' ? 'orange' : 'green';
        if (arg.view.type == 'listMonth') {
            var dotEl = arg.el.getElementsByClassName('fc-list-event-dot')[0];
            var titleEl = arg.el.getElementsByClassName('fc-list-event-title')[0];
            //console.log(titleEl);
            //console.log(titleEl.innerHTML)
            titleEl.innerHTML = "<span style='color: " + dotCOLOR + "';>" + titleEl.innerHTML + "</span>";
            dotEl.style.borderColor = dotCOLOR;
            titleEl.style.borderColor = dotCOLOR;
            // $('.fc-list-event-dot').css('border-color', color);
        }
        if (arg.view.type == 'dayGridMonth') {
            $('.fc-event-time').remove();
        }
    },
    headerToolbar: {
        left: 'prev, dayGridMonth',
        center: 'title',
        //right: 'dayGridMonth,timeGridWeek,timeGridDay next dayGrid2Weeks'
        right: 'timeGridDay ,next'
    },
    height: 'auto',
    // contentHeight: 'auto',
    //nowIndicator: true,
    //displayEventTime: false,
    locale: 'ja',
    //navLinks:日付をクリックするとクリックした日の表示になる
    navLinks: true,
    timeZone: 'Asia/Tokyo',
    eventTimeFormat: { hour: 'numeric', minute: '2-digit' },
    /*businessHours: [{
        daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
    }],*/
    //list-itemにすると予定にドットが付くようになる初期はドット
    eventDisplay: 'block',
    //
    //イベントの重複予約を不可
    //eventOverlap: false,
    //selectConstraint: "businessHours",
    editable: false,
    slotMinTime: '09:00:00',
    slotMaxTime: '18:00:00',
    ///最初に表示される画面を設定
    initialView: 'dayGridMonth', //'dayGrid2Weeks',
    ///
    slotLabelFormat: {
        hour: 'numeric',
        minute: '2-digit',
        omitZeroMinute: false
    },
    selectable: true,
    eventClick: function (info) {
        var mydialog_text = '送信'
        console.log(info.event);
        console.log(info.event.extendedProps.description);
        if (info.event.extendedProps.description['参加可否状態'] == '否') {
            var title = info.event.title.replace('【✖】', '');
            var warning_html = ' <p class="warning"><font color="red">参加ができない可能性があります。</font></p>';
        } else if (info.event.extendedProps.description['参加可否状態'] == '可') {
            var title = info.event.title;
            var warning_html = '';
        }

        if (location.pathname == '/New_TGL_Labo_Admin/' ||
            location.pathname == '/New_TGL_Labo/') {
            $('#Attendance_Status').remove();
            mydialog_text = '削除'
        }
        //2026変更 対面に設定されているなら遠隔ボタン、逆も然り
        if (info.event.extendedProps.description['実施方式'] == '対面') {
            var hennko = '遠隔'
        } else {
            var hennko = '対面'
        }

        //2026変更 日付が一致するか確かめるため変数を作成
        var today = new Date();
        today.setDate(today.getDate());
        const eventday = info.event.startStr.split('T')[0];
        console.log(eventday);
        console.log(formatDate(today, 'yyyy-MM-dd'));


        $('#click_info').html(title + "<br>&nbsp選択日時：" + format_Click_Date(info.event.startStr, info.event.endStr) + warning_html);
        $("#mydialog").dialog("open");

        //2026/6/12変更
        //dialogごと場合分け
        if (info.event.extendedProps.description['出席状態'] == '在室') {
            $("#mydialog").dialog({
                autoOpen: false, // 自動的に開かないように設定
                width: 'auto', // 横幅のサイズを設定
                modal: true, // モーダルダイアログにする
                buttons: [// ボタン名 : 処理 を設定
                    {
                        text: mydialog_text,
                        click: function () {

                            if (location.pathname == '/New_TGL_Labo_Admin/' ||
                                location.pathname == '/New_TGL_Labo/') {
                                var ajax_list_update = {
                                    type: 'delete',
                                    quantity: 0,
                                    csv_url: "/mnt/LMS-Main/TGL/Labo_Data/data-save-csv/Seminar.csv",
                                    ID: info.event.id,
                                }
                            } else {
                                var ajax_list_update = {
                                    type: "update",
                                    quantity: 1,
                                    csv_url: "/mnt/LMS-Main/TGL/Labo_Data/data-save-csv/Seminar.csv",
                                    update_key: info.event.id,
                                    update_column: '参加可否状態',
                                    update_value: $('input:radio[name="Attendance_Status"]:checked').val(),
                                };
                            }

                            console.log(ajax_list_update);
                            ajax(ajax_list_update).done(function (data) {
                                console.log(data);
                                location.reload();
                            }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
                                alert(errorThrown);
                            });
                        }
                    },
                    {
                        text: "キャンセル",
                        click: function () { $(this).dialog("close"); }
                    }
                ]
            });
        } else if (info.event.extendedProps.description['実施方式'] == '遠隔' || eventday != formatDate(today, 'yyyy-MM-dd')) {
            $("#mydialog").dialog({
                autoOpen: false, // 自動的に開かないように設定
                width: 'auto', // 横幅のサイズを設定
                modal: true, // モーダルダイアログにする
                buttons: [
                    //2026/4/20追加予定箇所
                    //登録されている出席形態に応じて、変更ボタンを追加
                    //対面なら遠隔、遠隔なら対面ボタンに
                    {
                        text: hennko,
                        click: function () {
                            var ajax_list_update = {
                                type: 'update',
                                quantity: 1,
                                csv_url: "/mnt/LMS-Main/TGL/Labo_Data/data-save-csv/Seminar.csv",
                                update_key: info.event.id,
                                update_column: '実施方式',
                                update_value: hennko,
                            }

                            console.log(ajax_list_update);
                            ajax(ajax_list_update).done(function (data) {
                                console.log(data);
                                location.reload();
                            }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
                                alert(errorThrown);
                            });

                        }
                    },
                    {
                        text: mydialog_text,
                        click: function () {

                            if (location.pathname == '/New_TGL_Labo_Admin/' ||
                                location.pathname == '/New_TGL_Labo/') {
                                var ajax_list_update = {
                                    type: 'delete',
                                    quantity: 0,
                                    csv_url: "/mnt/LMS-Main/TGL/Labo_Data/data-save-csv/Seminar.csv",
                                    ID: info.event.id,
                                }
                            } else {
                                var ajax_list_update = {
                                    type: "update",
                                    quantity: 1,
                                    csv_url: "/mnt/LMS-Main/TGL/Labo_Data/data-save-csv/Seminar.csv",
                                    update_key: info.event.id,
                                    update_column: '参加可否状態',
                                    update_value: $('input:radio[name="Attendance_Status"]:checked').val(),
                                };
                            }

                            console.log(ajax_list_update);
                            ajax(ajax_list_update).done(function (data) {
                                console.log(data);
                                location.reload();
                            }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
                                alert(errorThrown);
                            });
                        }
                    },
                    {
                        text: "キャンセル",
                        click: function () { $(this).dialog("close"); }
                    }
                ]
            });
        } else {
            $("#mydialog").dialog({
                autoOpen: false, // 自動的に開かないように設定
                width: 'auto', // 横幅のサイズを設定
                modal: true, // モーダルダイアログにする
                buttons: [
                    //2026/6/10追加予定
                    //対面の人のみ
                    //在室ボタン。押されたとき、カレンダーの名前が青になるように
                    //出席状態=在室に変更
                    {
                        text: '在室',
                        click: function () {
                            var ajax_list_update = {
                                type: 'update',
                                quantity: 1,
                                csv_url: "/mnt/LMS-Main/TGL/Labo_Data/data-save-csv/Seminar.csv",
                                update_key: info.event.id,
                                update_column: '出席状態',
                                update_value: '在室',
                            }

                            console.log(ajax_list_update);
                            ajax(ajax_list_update).done(function (data) {
                                console.log(data);
                                location.reload();
                            }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
                                alert(errorThrown);
                            });
                        }
                    },
                    {
                        text: hennko,
                        click: function () {
                            var ajax_list_update = {
                                type: 'update',
                                quantity: 1,
                                csv_url: "/mnt/LMS-Main/TGL/Labo_Data/data-save-csv/Seminar.csv",
                                update_key: info.event.id,
                                update_column: '実施方式',
                                update_value: hennko,
                            }

                            console.log(ajax_list_update);
                            ajax(ajax_list_update).done(function (data) {
                                console.log(data);
                                location.reload();
                            }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
                                alert(errorThrown);
                            });

                        }
                    },
                    {
                        text: mydialog_text,
                        click: function () {

                            if (location.pathname == '/New_TGL_Labo_Admin/' ||
                                location.pathname == '/New_TGL_Labo/') {
                                var ajax_list_update = {
                                    type: 'delete',
                                    quantity: 0,
                                    csv_url: "/mnt/LMS-Main/TGL/Labo_Data/data-save-csv/Seminar.csv",
                                    ID: info.event.id,
                                }
                            } else {
                                var ajax_list_update = {
                                    type: "update",
                                    quantity: 1,
                                    csv_url: "/mnt/LMS-Main/TGL/Labo_Data/data-save-csv/Seminar.csv",
                                    update_key: info.event.id,
                                    update_column: '参加可否状態',
                                    update_value: $('input:radio[name="Attendance_Status"]:checked').val(),
                                };
                            }

                            console.log(ajax_list_update);
                            ajax(ajax_list_update).done(function (data) {
                                console.log(data);
                                location.reload();
                            }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
                                alert(errorThrown);
                            });
                        }
                    },
                    {
                        text: "キャンセル",
                        click: function () { $(this).dialog("close"); }
                    }
                ]
            });
        }
    },


    eventSources: [{
        googleCalendarApiKey: 'AIzaSyASgUrK5Rl21g4U9wv-OnMHQ3B-YiyHqoo',
        googleCalendarId: 'japanese__ja@holiday.calendar.google.com',
        display: 'background',
        events: ajax({
            type: "load",
            quantity: 8,
            csv_url: "/mnt/LMS-Main/TGL/Labo_Data/data-save-csv/Seminar.csv",
            load_key1: "ID",
            load_key2: "日付",
            load_key3: "開始時刻",
            load_key4: "終了時刻",
            load_key5: "学生名",
            load_key6: "実施方式",
            load_key7: "参加可否状態",
            load_key8: "出席状態",
        }).done(function (data) {
            for (let i = 0; i < Object.keys(data).length; i++) {
                var csv_today = data[i]['日付'];

                if (csv_today == today) {
                    //console.log(csv_today + ' ' + today);
                    today_student.push({ '学生名': data[i]['学生名'], '出席状態': data[i]['出席状態'] });
                }
                //2026カラー変更
                //blueを追加
                var color = data[i]['出席状態'] == '在室' ? 'blue' : data[i]['実施方式'] == '対面' ? 'orange' : 'green';
                var classname = data[i]['参加可否状態'] == '否' ? 'non-attendance' : 'attendance';
                var stats = data[i]['参加可否状態'] == '否' ? '【✖】' : '';
                calendar.addEvent({
                    title: stats + data[i]['学生名'],
                    start: data[i]['日付'] + 'T' + data[i]['開始時刻'],
                    end: data[i]['日付'] + 'T' + data[i]['終了時刻'],
                    color: '#FFFFFF',
                    id: data[i]['ID'],
                    textColor: color,
                    eventOverlap: false,
                    display: 'block',
                    borderColor: 'black',
                    description: { '参加可否状態': data[i]['参加可否状態'], '実施方式': data[i]['実施方式'], '出席状態': data[i]['出席状態'] },
                    classNames: classname
                });
            }
            console.log(today_student);
            if (today_student.length) {
                const set_color = { '到着': 'blue', '遅刻': 'yellow', '欠席': 'red', 'その他': 'Green', 'none': 'black' }
                for (const property in today_student) {
                    //var stats_color = today_student[property]['出席状態'] == '到着' ? 'blue' : 'black';
                    var stats_color = set_color[today_student[property]['出席状態']];
                    //console.log(stats_color);
                    $('.today-student-table').append('<tbody><tr><td><font color="' + stats_color + '">' + today_student[property]['学生名'] + '</td></tr></tbody>');
                }
            } else {
                $('.today-student-table').html('予定されている卒研指導はありません。');
            }

            save(today_student);
            //console.log(today_student);
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            //console.log(errorThrown);
            console.log("NG:" + textStatus);
        })
    }],
    dateClick: function (dateClickInfo) {

        var dayEl = dateClickInfo.dayEl.firstChild.firstChild.firstChild;
        //console.log(dayEl);
        dayEl.click();
    },
    select: function (info) {
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const daymonth = info.startStr.split('T')[0];
        const StratTime = info.startStr.split('T')[1];
        const EndTime = info.endStr.split('T')[1];
        //console.log(check_day);
        if (
            daymonth >= formatDate(tomorrow, 'yyyy-MM-dd') &&
            (
                location.pathname == '/New_TGL_Labo_Admin/' ||
                location.pathname == '/New_TGL_Labo/'
            )
            /* && info.allDay == false*/
        ) {
            $('#select_data').html("選択日時：" + format_Click_Date(info.startStr, info.endStr));
            $("#mydialog2").dialog("open");
            $("#mydialog2").dialog({
                autoOpen: false, // 自動的に開かないように設定
                width: 'auto', // 横幅のサイズを設定
                modal: true, // モーダルダイアログにする
                buttons: [ // ボタン名 : 処理 を設定
                    {
                        text: '送信',
                        click: function () {

                            var select_student = $('select').val();
                            if (!select_student) {
                                $('.error-message').css('display', 'block');
                                //console.log(select_student);
                            } else {
                                //console.log(select_student);
                                ajax_list_write = {
                                    type: "write",
                                    quantity: 7,
                                    csv_url: "/mnt/LMS-Main/TGL/Labo_Data/data-save-csv/Seminar.csv",
                                    write_key1: daymonth,
                                    write_key2: StratTime,
                                    write_key3: EndTime,
                                    write_key4: select_student,
                                    write_key5: $('input:radio[name="Method"]:checked').val(),
                                    write_key6: "可",
                                    write_key7: 'none',
                                };
                                ajax(ajax_list_write)
                                    .done(function (data) {
                                        console.log(data);
                                        location.reload();
                                    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
                                        //alert(errorThrown);
                                        console.log("NG:" + textStatus.status);
                                    });
                            }

                        }
                    }
                ]
            });
        }/* else if (location.pathname == '/New_TGL_Labo/') {
            console.log('研究生ページです。')
        }*/ else {
            //console.log(formatDate(tomorrow, 'yyyy-MM-dd'));
            $('#error-modal').modal();
        }

    },

    editable: true, // ドラッグ＆ドロップを有効化
    eventStartEditable: true,
    eventDurationEditable: true,
    droppable: true, // 外部からのドロップを許可


    eventDragStart: function (info) {
        // 複製フラグをセット（例: Ctrlキーが押されている場合）
        if (event.ctrlKey || event.metaKey) {
            // 元のイベントIDを取得してextendedPropsに設定
            info.event.setExtendedProp('originalId', info.event.id);
        }
    },


    // 2026/5/11 追加予定箇所
    // 元イベントが遠隔かどうかを確認(対面じゃないか)
    //->遠隔の場合、カット&ペーストを行う
    // 2026/6/1 変更予定箇所
    // 元イベントが遠隔かどうかにかかわらず、消して、移動
    eventDrop: function (info) {
        // ドラッグ＆ドロップされたイベントを確認
        const daymonth = info.event.startStr.split('T')[0]; // 日付
        const StratTime = info.event.startStr.split('T')[1]; // 開始時刻
        const EndTime = info.event.endStr ? info.event.endStr.split('T')[1] : ''; // 終了時刻

        // 新しいイベントのID（コピー元IDを利用する場合）
        const newId = generateUniqueId(); // 新しいIDを生成

        // 元のイベントID（コピー元イベントのID）
        const originalId = info.event.extendedProps.originalId || info.event.id;

        // 保存するデータ
        const ajax_list_write = {
            type: "write",
            quantity: 7,
            csv_url: "/mnt/LMS-Main/TGL/Labo_Data/data-save-csv/Seminar.csv",
            write_key1: daymonth, // 日付
            write_key2: StratTime, // 開始時刻
            write_key3: EndTime, // 終了時刻
            write_key4: info.event.title, // 学生名
            write_key5: info.event.extendedProps.description?.['実施方式'] || '対面', // 実施方式
            write_key6: info.event.extendedProps.attendanceStatus || '可', // 参加可否状態
            //2026/6/12変更 移動した際に在室状態が外れるのを防ぐため
            write_key7: info.event.extendedProps.description['出席状態'] || 'none', // 出席状態
            write_key8: originalId, // 元のID（コピー元ID）
            write_key9: newId // 新しいID
        };



        // 送信する前に確認
        console.log(JSON.stringify(ajax_list_write));  // 送信されるデータの確認

        // サーバーに保存
        saveToCSV(ajax_list_write)
            .done(function (response) {
                console.log('イベントがCSVに保存されました:', response);
                alert('イベントがCSVに保存されました！');
            })
            .fail(function (error) {
                console.error('CSV保存エラー:', error);
                alert('CSV保存中にエラーが発生しました。');
            });

        //2026/5/11
        //オリジナルが遠隔かどうかを確認,遠隔であれば元の予定を消去
        /*なぜか=='遠隔'だと動かないっぽい*/
        //2026/6/1変更
        //ifを消せば、イベント一つの移動はカット&ペーストになるはず
        /*if (info.event.extendedProps.description['実施方式'] != '対面') {*/
        var ajax_list_update = {
            type: 'delete',
            quantity: 0,
            csv_url: "/mnt/LMS-Main/TGL/Labo_Data/data-save-csv/Seminar.csv",
            ID: originalId,
        }
        console.log(ajax_list_update);
        ajax(ajax_list_update).done(function (data) {
            console.log(data);
            location.reload();
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
        });

        /*}*/
    },


    eventDragStop: function (info) {
        // 複製フラグをリセット
        info.event.setExtendedProp('copy', false);
    },

    //2026/6/8追加予定
    //終了予定時間の拡大縮小
    eventResize: function (info) {
        const EndTime = info.event.endStr.split('T')[1];
        const ajax_list_update = {
            type: 'update',
            quantity: 1,
            csv_url: "/mnt/LMS-Main/TGL/Labo_Data/data-save-csv/Seminar.csv",
            update_key: info.event.id,
            update_column: "終了時刻",
            update_value: EndTime,
        };

        console.log(ajax_list_update);
        ajax(ajax_list_update).done(function (data) {
            console.log(data);
            alert("終了時刻の変更を保存しました");
            location.reload();
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
        });
    },
    //ここまで

});

calendar.render();

// 日単位ドラッグコピー機能
let dragStartDate = null;

// 日付タップで開始
$(document).on("mousedown touchstart", ".fc-daygrid-day", function (e) {
    e.stopPropagation();
    dragStartDate = $(this).closest(".fc-daygrid-day").data("date"); // 元の日付
    $(this).addClass("dragging-day");
});

// 指を離したらコピー
$(document).on("mouseup touchend", ".fc-daygrid-day", function (e) {
    e.stopPropagation();
    const dragEndDate = $(this).closest(".fc-daygrid-day").data("date");
    $(".fc-daygrid-day-frame").removeClass("dragging-day");

    if (!dragStartDate || dragStartDate === dragEndDate) {
        dragStartDate = null;
        return;
    }


    // 元日付に登録されているイベントを取得
    const events = calendar.getEvents().filter(ev => {
        const eventDate = ev.startStr.split("T")[0];
        return eventDate === dragStartDate;
    });

    if (events.length === 0) {
        alert("この日に登録されているイベントはありません。");
        dragStartDate = null;
        return;
    }

    // 保存用Promise配列を初期化
    let savePromises = [];

    // イベントを新しい日付にコピーして保存
    events.forEach(ev => {
        const startTime = ev.startStr.split("T")[1];
        const endTime = ev.endStr ? ev.endStr.split("T")[1] : '';
        const newId = generateUniqueId();

        const ajax_list_write = {
            type: "write",
            quantity: 7,
            csv_url: "/mnt/LMS-Main/TGL/Labo_Data/data-save-csv/Seminar.csv",
            write_key1: dragEndDate,
            write_key2: startTime,
            write_key3: endTime,
            write_key4: ev.title,
            write_key5: ev.extendedProps.description['実施方式'] || '対面',
            write_key6: ev.extendedProps.description['参加可否状態'] || '可',
            //2026/6/12 変更,意図しない形での出席状態のコピーをしないため
            write_key7: ev.extendedProps.description['出席状態'] = 'none',
            write_key8: ev.id,
            write_key9: newId
        };

        console.log("【日付コピー保存】", ajax_list_write);
        savePromises.push(saveToCSV(ajax_list_write));
    });

    // すべての保存が終わったら完了
    Promise.all(savePromises)
        .then(() => {
            alert("日付コピーが完了しました！");
            location.reload();
        })
        .catch(error => {
            console.error("コピー保存エラー:", error);
            alert("コピー保存中にエラーが発生しました。");
        });

    dragStartDate = null;
});



// CSV保存用の関数

function saveToCSV(data) {
    return $.ajax({
        type: "POST",
        url: "/cgi-bin/save_event_v2.py", // サーバーサイドの保存スクリプト
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: "json"
    });
}

function ajax(data) {
    return $.ajax({
        type: "POST",
        url: "../tgl/PythonScripts/Seminar.py",
        data: JSON.stringify(data),
        dataType: "json"
    })
}

function save(data) {
    Seminar_list = data;
    console.log(Seminar_list);
    return 'today_student';
}

function formatDate(date, format) {
    format = format.replace(/yyyy/g, date.getFullYear());
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
    format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
    format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3));
    return format;
};

function format_Click_Date(start_time, end_time) {
    if (!start_time) return "不明な日時";  // start_timeが無い場合

    const [startDatePart, startTimePart] = start_time.split("T");
    const [year, month, day] = startDatePart.split("-");
    const [hour, minute] = startTimePart.split(":");

    let format = `${year}年${month}月${day}日<br>${hour}時${minute}分`;

    if (end_time) {
        const [, endTimePart] = end_time.split("T");
        const [endHour, endMinute] = endTimePart.split(":");
        format += `～${endHour}時${endMinute}分`;
    }
    return format;
};

function generateUniqueId() {
    return 'event-' + new Date().getTime(); // 現在のタイムスタンプを利用
};

