# サイト
[https://park-story.herokuapp.com/](https://park-story.herokuapp.com/)
# 用語
|用語|英語表記|意味|
|----|----|----|
|ユーザー|user|利用者|
|コース|course|公園のコース|
|候補|candidate|候補時間|
|参加予定|appointment|参加意思|
|掲示板|board|掲示板|

# URL設計
|パス|メソッド|ページ内容|
|----|----|----|
|/|GET|トップ/コース一覧|
|/mypage/:userId|GET|マイページ/参加予定コース表示|
|/login|GET|ログイン|
|/logout|GET|ログアウト|
|/course/new|GET|コース作成ページ（管理者専用）|
|/course/:courseId/:candidateId|GET|コース詳細ページ/参加表明時、参加者表示/参加用掲示板|
|/course/:courseId/:candidateId/edit|GET|コース編集ページ|

## WebAPIのURL
|パス|メソッド|処理内容|利用方法|
|----|----|----|----|
|/course|POST|コース作成|フォーム|
|/course/:courseId/:candidateId/?edit=1|POST|コース編集|フォーム|
|/course/:courseId/:candidateId/:userId/submit|POST|参加表明|フォーム|
|/course/:courseId/:candidateId/:userId/ajax|POST|参加更新|Ajax|
|/course/:courseId/:candidateId?delete=1|POST|候補時間、参加表明削除|Ajax|
|/course/:courseId/:candidateId/?post=1|POST|掲示板へ投稿|フォーム|

# モジュール設計
## Router モジュール一覧
|ファイル名|責務|
|----|----|
|routes/mypage.js|マイページに関する処理|
|routes/login.js|ログイン処理|
|routes/logout.js|ログアウト処理|
|routes/course.js|コースに関連する処理|
|routes/appointment.js|参加の更新に関する処理|
|routes/authentication-ensurer.js|facebook認証|
|routes/board.js|掲示板に関する処理|

## データモデル一覧
|ファイル名|責務|テーブル名|
|----|----|----|
|models/user.js|ユーザーの定義と永続化|users
|models/course.js|コースの定義と永続化|courses
|models/candidate.js|候補の定義と永続化|candidates
|models/appointment.js|参加の定義と永続化|appointments
|models/board.js|掲示板の定義と永続化|boards

|user の属性名|形式|内容|
|----|----|----|
|userId|数値|facebookのユーザーID 主キー|
|userName|文字列|facebookのユーザー名|
|userImg|文字列|facebookのプロフィール画像|

|course の属性名|形式|内容|
|----|----|----|
|courseId|数値|ID 主キー 連番|
|courseName|文字列|コース名|
|courseMemo|文字列|コースの説明|
|courseDay|日付|開催日|
|courseImgFile|文字列|コースの画像|

|candidate の属性名|形式|内容|
|----|----|----|
|candidateId|数値|ID 主キー 連番|
|candidateTime|文字列|開催時間|
|courseId|数値|関連するコースID|

|appointment の属性名|形式|内容|
|----|----|----|
|candidateId|数値|ID 主キー 連番|
|userId|数値|facebookのユーザーID 主キー|
|appointment|数値|参加ID|
|courseId|数値|関連するコースID|

|board の属性名|形式|内容|
|----|----|----|
|boardId|数値|ID 主キー 連番|
|candidateId|数値|候補ID|
|boardContent|文字列|投稿内容|
|postBy|数値|facebookのユーザーID|


