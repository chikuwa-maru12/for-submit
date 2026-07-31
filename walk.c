#include <GL/glut.h>
#include <math.h>
#include <stdio.h>
#include <stdlib.h>
GLint point[2];        /*マウスを押した座標を格納する*/
GLint center[2];       /*windowの中心*/
GLdouble nextpoint[3]; /*0x,1y,2r*/
GLint time = 100;
GLdouble vec[2];
int reset = 0;

void idle(void) { glutPostRedisplay(); }

void scene(void) {
  static GLfloat red[] = {0.8, 0.2, 0.2, 1.0};
  static GLfloat green[] = {0.2, 0.8, 0.2, 1.0};
  static GLfloat blue[] = {0.2, 0.2, 0.8, 1.0};
  static GLfloat yellow[] = {0.8, 0.8, 0.2, 1.0};
  static GLfloat ground[][4] = {{0.6, 0.6, 0.6, 1.0}, {0.3, 0.3, 0.3, 1.0}};

  glPushMatrix();

  glTranslated(0.0, 0.0, -3.0);
  glMaterialfv(GL_FRONT, GL_DIFFUSE, red);
  glutSolidCube(1.0);

  glTranslated(0.0, 0.0, 3.0);
  glMaterialfv(GL_FRONT, GL_DIFFUSE, green);
  glutSolidCube(1.0);

  glTranslated(-3.0, 0.0, 0.0);
  glMaterialfv(GL_FRONT, GL_DIFFUSE, blue);
  glutSolidCube(1.0);

  glTranslated(3.0, 0.0, 0.0);
  glMaterialfv(GL_FRONT, GL_DIFFUSE, yellow);
  glutSolidCube(1.0);

  glPopMatrix();

  glBegin(GL_QUADS);
  glNormal3d(0.0, 1.0, 0.0);
  for (int j = -5; j < 5; ++j) {
    for (int i = -5; i < 5; ++i) {
      glMaterialfv(GL_FRONT, GL_DIFFUSE, ground[(i + j) & 1]);
      glVertex3d((GLdouble)i, -0.5, (GLdouble)j);
      glVertex3d((GLdouble)i, -0.5, (GLdouble)(j + 1));
      glVertex3d((GLdouble)(i + 1), -0.5, (GLdouble)(j + 1));
      glVertex3d((GLdouble)(i + 1), -0.5, (GLdouble)j);
    }
  }
  glEnd();
}

void display(void) {
  static GLfloat lightpos[] = {3.0, 4.0, 5.0, 1.0};

  static double ex = 0.0, ez = 0.0;
  static double r = 0.0;
  static double rb = 0.0;

  glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

  glLoadIdentity();

  glRotated(r, 0.0, 1.0, 0.0);  // (回転)
  glTranslated(ex, 0.0, ez);    //（移動先の座標）

  glLightfv(GL_LIGHT0, GL_POSITION, lightpos);

  scene();

  glFlush();

  //ここから
  // rは角度
  /*ウィンドウの座標から、3Dの座標へ変換*/
  printf("A->B (%d,%d)\n", (point[0] - center[0]), (center[1] - point[1]));
  double v1 = hypot((point[0] - center[0]), (center[1] - point[1]));
  double a = atan2((center[1] - point[1]), (point[0] - center[0]));  // ラジアン
  double v2 = v1 * sin(a);  // sin,cosはラジアン
  double ra = v1 * cos(a);
  /*回転*/
  r += ra / 180;
  if (r > 360) {
    r -= 360;
  }
  if (r < -360) {
    r += 360;
  }
  /*移動*/
  rb = r;

  double sita = r * 3.14 / 180;  // rをラジアンにする

  printf("%f\n", rb);

  ex += v2 * sin(-sita) / 1000;
  ez += v2 * cos(sita) / 1000;

  printf("(ex,ey,ez)=(%f,0,%f)\n", ex, ez);
  if (reset > 0) {
    reset = 0;
    r = 0;
    rb = 0;
    ex = 0;
    ez = 0;
    vec[0], vec[1] = 0;
  }
  //ここまで
}

void resize(int w, int h) {
  /*ウィンドウの中心座標*/
  center[0] = w / 2;
  center[1] = h / 2;

  glViewport(0, 0, w, h);

  glMatrixMode(GL_PROJECTION);

  glLoadIdentity();
  gluPerspective(30.0, (double)w / (double)h, 1.0, 100.0);

  glMatrixMode(GL_MODELVIEW);
}

//ここから
void mouse(int button, int state, int x, int y) {
  switch (button) {
    //左クリックで前進
    case GLUT_LEFT_BUTTON:
      point[0] = x, point[1] = y;
      if (state == GLUT_DOWN) {
        glutIdleFunc(idle);

      } else {
        time = 100;
        glutIdleFunc(0);
      }
      break;
    //右クリックでデフォルトの座標に戻る
    case GLUT_RIGHT_BUTTON:
      if (state == GLUT_DOWN) {
        reset++;
        time = 100;
        glutPostRedisplay();
      }
      break;
    default:
      break;
  }
}

void motion(int x, int y) {
  /*ドラッグ検知！*/
  point[0] = x, point[1] = y;
  printf("2:x = %d, y = %d\n", x, y); /*座標表示*/
}
//ここまで

void keyboard(unsigned char key, int x, int y) {
  if (key == '\033' || key == 'q') {
    exit(0);
  }
}

void init(void) {
  glClearColor(1.0, 1.0, 1.0, 0.0);
  glEnable(GL_DEPTH_TEST);
  glEnable(GL_CULL_FACE);
  glEnable(GL_LIGHTING);
  glEnable(GL_LIGHT0);
}

int main(int argc, char* argv[]) {
  glutInit(&argc, argv);
  glutInitDisplayMode(GLUT_RGBA | GLUT_DEPTH);
  glutCreateWindow(argv[0]);
  glutDisplayFunc(display);
  glutReshapeFunc(resize);
  glutMouseFunc(mouse);
  glutMotionFunc(motion);
  glutKeyboardFunc(keyboard);
  init();
  glutMainLoop();
  return 0;
}
