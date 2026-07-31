// マインスイーパ抽象化バージョン

#include <stdio.h>
#include <stdlib.h>
#include <time.h>

// 定数定義
#define area_xy 8    // マップマス定義, area*area
#define mine_num 6   // 地雷の数
#define sign_mine 9  // 地雷であると判断したとき、マスに代入する値

// プロトタイプ宣言
void initialize(int board[area_xy][area_xy]);
// ボード初期化,入力記録用配列初期化
void check(int board[area_xy][area_xy]);      // ボード確認用関数
void land_mine(int board[area_xy][area_xy]);  // 地雷設置 + *1
int check_eight(int i, int j, int board[area_xy][area_xy]);
// 周り八近傍にマス(存在する配列)があるか*1　
void game_loop(int board[area_xy][area_xy], int imput_b[area_xy][area_xy]);

void zero(int i, int j, int imput_b[area_xy][area_xy],
          int board[area_xy][area_xy]);
// 開けたマスが0だった時、起動


// メイン
int main(int argc, char** argv) {
  int main_board[area_xy][area_xy], imput_board[area_xy][area_xy];
  initialize(main_board);
  land_mine(main_board);
  initialize(imput_board);
  //check(main_board);
  //中身を確認する用の関数、デバッグ時に使用
  game_loop(main_board, imput_board);
  return 0;
}

// ボード初期化関数
void initialize(int board[area_xy][area_xy]) {
  for (int i = 0; i < area_xy; i++) {
    for (int j = 0; j < area_xy; j++) {
      board[i][j] = 0;
    }
  }
}
// ボード確認用関数
void check(int board[area_xy][area_xy]) {
  for (int i = 0; i < area_xy; i++) {
    for (int j = 0; j < area_xy; j++) {
      printf("%d ", board[i][j]);
    }
    printf("\n");
  }
}
// 地雷設置
void land_mine(int board[area_xy][area_xy]) {
  srand((unsigned int)time(NULL));
  int mine_count = 0;
  while (mine_count < mine_num) {
    int i, j;
    i = rand() % area_xy;
    j = rand() % area_xy;
    // printf("(%d,%d) ", i, j);
    if (board[i][j] > sign_mine - 1) {
    } else {
      board[i][j] = sign_mine;
      check_eight(i, j, board);
      mine_count++;
    }
  }
  // printf("\n");
}
// ヒントの数字
int check_eight(int i, int j, int board[area_xy][area_xy]) {
  //[i-1]
  if (i - 1 >= 0) {
    if (j - 1 >= 0) {
      board[i - 1][j - 1]++;
    }
    board[i - 1][j]++;
    if (j + 1 < area_xy) {
      board[i - 1][j + 1]++;
    }
  }
  //[i]
  if (j - 1 >= 0) {
    board[i][j - 1]++;
  }
  if (j + 1 < area_xy) {
    board[i][j + 1]++;
  }
  //[i+1]
  if (i + 1 < area_xy) {
    if (j - 1 >= 0) {
      board[i + 1][j - 1]++;
    }
    board[i + 1][j]++;
    if (j + 1 < area_xy) {
      board[i + 1][j + 1]++;
    }
  }
}
// メインゲームループ
void game_loop(int board[area_xy][area_xy], int imput_b[area_xy][area_xy]) {
  while (1) {
    // クリア判定処理
    int open_count = 0;
    for (int i = 0; i < area_xy; i++) {
      for (int j = 0; j < area_xy; j++) {
        if (imput_b[i][j] > 0) {
          open_count++;
        }
      }
    }
    if (open_count == area_xy * area_xy - mine_num) {
      printf("Game Clear!\n");
      // 答え
      for (int i = 0; i < area_xy; i++) {
        for (int j = 0; j < area_xy; j++) {
          if (board[i][j] > sign_mine - 1) {
            printf("* ");
          } else {
            printf("%d ", board[i][j]);
          }
        }
        printf("\n");
      }
      break;
    }

    // 現在のボード表示
    printf("   ");

    for(int i = 0;i<area_xy;i++){
      printf(" %d",i+1);
    }
    printf("\n");

    for (int i = 0; i < area_xy; i++) {
      printf("%d | ", i + 1);
      for (int j = 0; j < area_xy; j++) {
        if (imput_b[i][j] > 0) {
          printf("%d ", board[i][j]);
        } else {
          printf("# ");
        }
      }
      printf("\n");
    }

    // 入力処理
    int i, j;
    printf("gyou(up,down): ");
    scanf("%d", &i);
    printf("retu(right,left): ");
    scanf("%d", &j);
    i--;
    j--;

    // ゲームオーバー処理
    if (board[i][j] > sign_mine - 1) {
      // 答え
      for (int i = 0; i < area_xy; i++) {
        for (int j = 0; j < area_xy; j++) {
          if (board[i][j] > sign_mine - 1) {
            printf("* ");
          } else {
            printf("%d ", board[i][j]);
          }
        }
        printf("\n");
      }
      printf("Game Over!\n");
      break;
    } else {
      imput_b[i][j]++;
      // 開けたところが0の場合、数字が出るまで開く
      if (board[i][j] == 0) {
        zero(i, j, imput_b, board);
      }
    }
  }
}
// ゼロ時関数
void zero(int i, int j, int imput_b[area_xy][area_xy],
          int board[area_xy][area_xy]) {
  for (int di = -1; di < 2; di++) {
    if (i + di < 0 || i + di >= area_xy) {
      continue;  // j=-1,area_xyにならないように
    }
    for (int dj = -1; dj < 2; dj++) {
      if (j + dj < 0 || j + dj >= area_xy) {
        continue;  // j=-1,area_xyにならないように
      }
      if (imput_b[i + di][j + dj] == 0) {
        imput_b[i + di][j + dj] = 1;
        if (board[i + di][j + dj] == 0) {
          zero(i + di, j + dj, imput_b, board);
        }
      }
    }
  }
}
