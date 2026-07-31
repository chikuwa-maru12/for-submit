#text box
import tkinter

  
def delete(e):
    canvas.delete("box")

a = 0


def textb():
    moji="文字列表示"
    global a
    
    x = 21 + (22 * a)
    print(x)
    canvas.create_text(x,400,text=moji[a],fill="white",font=("System",20))
    a = a + 1
    if a < 5:
        root.after(400,textb)
    else:
        canvas.create_polygon(480,480,490,490,500,500,fill="white")
    
def textc():
    moji="文字列表示"
    global a

    if a < 5:
        x = 21 + (22 * a)
        print("a:"+ str(a) +" x:" + str(x))
        canvas.create_text(x,400,text=moji[a],fill="white",font=("System",20))
    else:
        print("a:"+ str(a))
        #条件式注意！今回は奇数からなのでdeleteで困ることはないけど
        if a % 2 != 0:
            canvas.create_polygon(490,490,480,480,500,480,fill="white",outline="white",tag="poligon")
        else:
            canvas.delete("poligon")

    a = a + 1
    root.after(400,textc)

    #文字列読み込み
    #可変文字列長に対応した座標指定
    #def textd():

def textd():

    f = open('mytxt.txt', 'r',encoding="utf-8")
    moji = f.readline()
    #leng = len(moji)
    #print(moji)
    f.close()
    
    global a

    if a < len(moji):
        x = 21 + (22 * a)
        print("a:"+ str(a) +" x:" + str(x))
        canvas.create_text(x,400,text=moji[a],fill="white",font=("System",20))
    else:
        print("a:"+ str(a))
        #条件式注意！今回は奇数からなのでdeleteで困ることはないけど
        if a % 2 != 0:
            canvas.create_polygon(490,490,480,480,500,480,fill="white",outline="white",tag="poligon")
        else:
            canvas.delete("poligon")

    a = a + 1
    root.after(400,textd)




root = tkinter.Tk()
root.title("テキストボックス再現")
#root.geometry("800x600")
canvas = tkinter.Canvas(width=500,height=500,bg="lime")
canvas.pack()

canvas.create_rectangle(0,350,500,500,fill="purple",width=10,tag="box")
canvas.create_text(65,375,text="文字列表示",fill="white",font=("System",20))
#("文字列表示"の真ん中x=65だったみたいです)

f = open('mytxt.txt', 'r',encoding="utf-8")

datalist = f.readlines()
data = len(datalist)
for i in range(data):
  print(datalist[i].rstrip('\n'))
f.close()



moji="chikuwa"
#textb()
#textc()
textd()





#root.bind("<ButtonPress>",textb)

#root.bind("<ButtonPress>",delete)


root.mainloop()

#csv読みtxtでも ok
#テキストボックス表示 ok
#文字表示が終わっている時、エンター、スペース押すと次の内容へ
#文字表示が終わったら、ちっちゃい三角を点滅 ok
#文字表示一文字ずつ ok
#文字表示中にエンター、スペースが押されると、一文字ずつの処理をやめ、全文表示


#.txtの読み込みとか
# https://www.javadrive.jp/python/file/index2.html
