# Miwataru

主にスキル向上を目的に、ポートフォリオとしてタスク管理アプリ (**Miwataru**) を作成しました。  

これはシングルページアプリケーション (SPA) として作成しており、フロントエンドには、**TypeScript / React**、バックエンドには、**PHP / Laravel**、インフラには、**Vercel** (静的サイト) / **AWS Lambda** (API) を使用しています。詳細は後述の[開発環境 (フロントエンド)](#開発環境-フロントエンド)、[開発環境 (バックエンド)](#開発環境-バックエンド)、[本番環境](#本番環境)をご覧ください。  

アプリケーションや実装過程の説明については、以下のリンクからアクセスできます。  

- アプリケーション: [https://www.miwataru.com/](https://www.miwataru.com/)
- フロントエンド実装過程: [https://github.com/zuka-e/laravel-react-task-spa/blob/development/frontend/README.md](https://github.com/zuka-e/laravel-react-task-spa/blob/development/frontend/README.md)
- バックエンド実装過程: [https://github.com/zuka-e/laravel-react-task-spa/blob/development/backend/README.md](https://github.com/zuka-e/laravel-react-task-spa/blob/development/backend/README.md)

**※ 注釈**  
SPA開発におけるGitHubのリポジトリについて、フロントエンドとバックエンドを同一のリポジトリにする方法と別に作成する方法が考えられますが、今回は同じリポジトリ内で開発を行っています。  

ただこの場合GitログやBranchが混同するため、例えばフロントエンド側での記録のみを確認する場合に邪魔になることがあり、その観点ではリポジトリを分割した方が良さそうです。  

分割する場合、フロントエンドとバックエンド間に依存関係があると困りますが、今回の場合これは特に問題ありません。バックエンドのサーバーが動作していれば、APIリクエストの確認も行うことが可能です。また、適切なテスト環境が整っていればそれぞれ独自に開発を進めることもできるので、コード自体に相互依存関係はありません。機会があればリポジトリを分割する方法も試行しようと思います。  

## 目次

- [機能](#機能)
- [開発環境 (フロントエンド)](#開発環境-フロントエンド)
- [開発環境 (バックエンド)](#開発環境-バックエンド)
- [本番環境](#本番環境)
  - [インフラ構成図](#インフラ構成図)
- [ER図](#er図)
  - [MySQL Workbench](#mysql-workbench)
- [使用技術 (フロントエンド)](#使用技術-フロントエンド)
- [使用技術 (バックエンド)](#使用技術-バックエンド)
- [使用技術 (その他)](#使用技術-その他)
- [画面](#画面)
  - [ホーム](#ホーム)
  - [ログイン](#ログイン)
  - [ユーザー登録](#ユーザー登録)
  - [マイページ](#マイページ)
  - [メールアドレス認証](#メールアドレス認証)
    - [認証確認通知](#認証確認通知)
    - [認証用メール](#認証用メール)
    - [未認証警告+再送信ボタン (マイページ)](#未認証警告再送信ボタン-マイページ)
  - [パスワードリセット](#パスワードリセット)
    - [再設定リクエスト](#再設定リクエスト)
    - [再設定用メール](#再設定用メール)
  - [ボードCRUD](#ボードcrud)
  - [リストCRUD](#リストcrud)
  - [カードCRUD](#カードcrud)
  - [絞り込み](#絞り込み)
  - [並び替え](#並び替え)
  - [検索](#検索)
- [各種リンク](#各種リンク)

## 機能

- 認証
  - ログイン / ログアウト
    - Cookie / セッション
  - ユーザー登録 / 表示 (マイページ) / 更新 / 削除
  - メールアドレス認証
    - 未認証ユーザー削除 (定期処理)
  - ユーザーパスワード更新
  - パスワードリセット
  - ゲストユーザーログイン (認証済み)
  - ゲストユーザー登録 (未認証、ランダムメールアドレス)
- タスク (カード) 管理
  - 作成 / 表示 / 更新 / 削除
  - リスト (カードグループ) 作成 / 表示 / 更新 / 削除
  - ボード (リストグループ) 作成 / 表示 / 更新 / 削除
  - 絞り込み
  - 並び替え
    - 選択型 (日付、昇順 / 降順)
    - ドラッグ&ドロップ型
    - 状態保持
  - 検索
  - ページネーション

## 開発環境 (フロントエンド)

フロントエンドの開発言語として**TypeScript**を使用し、ライブラリとして使用したのは**React**です。またこれらを基本とした開発環境の構築には**Create React App** (**CRA**)を用いており、これによって、Reactを実行し結果を確認できるサーバーなどのReactの利用に必要な環境が簡単に用意できます。その他実行環境は以下のようになっています。(括弧内の数字はバージョン)  

- [Create React App](https://create-react-app.dev) (4.0.3)
  - [Yarn](https://yarnpkg.com/) (1.22.10)
  - [Node.js](https://nodejs.org/) (16.6.1)
  - [TypeScript](https://www.typescriptlang.org/) (4.2.4)
  - [React](https://reactjs.org) (17.0.2)

尚、動作確認のブラウザには、Chrome (Mac、Android) を使用しています。

## 開発環境 (バックエンド)

バックエンドの開発言語には**PHP**、Webアプリケーションフレームワークには**Laravel**を利用しました。開発環境の構築には、Laravelから公式に提供されている**Laravel Sail**を用いており、これを実行することで開発用のサーバーが起動し、データベースやセッションストアの他、メール送信まで行うことができる環境が整います。  

Laravel Sailにデフォルトで用意されている環境はカスタマイズすることも可能ですが、今回は特に変更を行っておらず、構築した環境は以下のようなものです。  

- [Docker for Mac](https://docs.docker.com/desktop/mac/release-notes/) (3.6.0)
- [Laravel Sail](https://laravel.com/docs/8.x/sail) (1.4.7)
  - PHP (8.0.5)
  - [Laravel](https://laravel.com/) (8.32.1)
  - [MySQL](https://www.mysql.com/) (8.0.23) - RDB
  - [Redis](https://redis.io/) (6.0.10) - キャッシュ、セッションストア
  - [MailHog](https://github.com/mailhog/MailHog) - メール送受信

## 本番環境

フロントエンド側で生成された静的ファイルのホスティングサービスとして、**Vercel**を選択しました。一方、バックエンドで作成したAPIは、**AWS Lambda**で実行しています。そこで使用したサービスと用途については以下に列挙した通りです。  

- [Vercel](https://vercel.com/) - 静的ファイルホスティング
- [CloudFormation](https://docs.aws.amazon.com/cloudformation/) - AWSリソース構成
- [Certificate Manager](https://docs.aws.amazon.com/acm/) - SSL/TLS 証明書発行 (API用カスタムドメイン)
- [API Gateway](https://docs.aws.amazon.com/apigateway/) - API (Lamdba) アクセス
- [Lamdba](https://docs.aws.amazon.com/lambda/) - サーバレスコンピューティング (Laravelアプリ実行)
- [VPC](https://docs.aws.amazon.com/vpc/index.html) - 仮想ネットワーク構成
- [VPC Endpoint](https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints.html) - VPC内外プライベート接続
- [RDS](https://docs.aws.amazon.com/rds/) (MariaDB 10.4.13) - RDB
- [DynamoDB](https://docs.aws.amazon.com/dynamodb/) - キャッシュ、セッションストア
- [S3](https://docs.aws.amazon.com/s3/) -  アセットストア
- [Amazon SES](https://docs.aws.amazon.com/ses/) (SMTPインターフェイス) - カスタムドメインメール送信
- [IAM](https://docs.aws.amazon.com/iam/) (ユーザー、ロール、ポリシー) - アクセス管理
- [Systems Manager](https://docs.aws.amazon.com/systems-manager/) (パラメータストア) - 機密情報保管
- [CloudWatch](https://docs.aws.amazon.com/cloudwatch/) (ログ, イベント) - ログ管理、Lamdba関数トリガー (Cron)

### インフラ構成図

アプリケーションの基本的な処理の流れとしては以下の通りです。  

1. ユーザーは、VercelにデプロイされたURLからアプリケーションにアクセス
2. APIの機能が必要な場合は、API Gatewayに向かってリクエストを送信
3. API Gatewayによって呼ばれたLambdaが以下のような処理を実行
   1. Cookieの付与、DynamoDBによるセッション管理
   2. データベースからデータの取得や更新
   3. 必要に応じてユーザーにメールを送信
   4. ログをCloudWatchに保存

これを表しているのが以下の図です。  

![Infrastructure_configuration_diagram](https://raw.githubusercontent.com/zuka-e/images/miwataru/Miwataru/AWS_diagram.svg)

上記で触れていないポイントについて簡潔に説明していきます。  

まず図の上部のCloudFormationについて、これは設定ファイルに基づいてAWSリソースの構成が役割です。このとき例えばパスワードなどの秘匿情報が必要となるので、Systems Managerのパラメータストアという機能を用いてその値を安全に扱っています。  

次に、Certificate Managerについて、これはカスタムドメインに対するSSL/TLS 証明書の発行を行っています。ここで設定するドメインはブラウザのURL欄に表示されるものではなくその**サブドメイン**です。ユーザーが直接アクセスするメインのドメインはVercelによって設定を行います。  

次に、Lamdbaについて、まず前提として通常LambdaをVPC内に設置しませんが、ここではVPCと共に構成しています。これはRDSとの接続を行うためです。RDSはVPC内に設置されているので、アクセスするためにはパブリックアクセスを有効にするかまたはVPCから行う必要があります。後者の方がセキュリティの観点で優れているため、VPC内でLamdbaを利用しています。  

一方、LambdaはDynamoDB及びSESにも接続していますが、これらはRDSとは異なりVPC外のリソースです。通常アクセスするためには、Lambdaのロールに適切なポリシーをアタッチするのですが、**VPC Lambdaはインターネットに接続不可能**という問題があり、これだけではまだVPCの外に存在するリソースにアクセスできません。そこで、間にEndpointを挟むことでその問題を解決することが可能です。  

最後に図の下部に位置しているLambdaについて、これは先述のものとは異なり、APIリクエストによって実行されるのではなくイベントをトリガーとして起動します。ここではスケジュールをイベントとし、指定した時間になると事前に設定した関数を実行する仕組みになっています。  

以上が今回構成したインフラの概要です。

> 参考：  
> [Environment variables - Bref # Secrets](https://bref.sh/docs/environment/variables.html#secrets)  
> [Custom domain names - Bref](https://bref.sh/docs/environment/custom-domains.html)  
> [Using a database - Bref # Accessing the internet](https://bref.sh/docs/environment/database.html#accessing-the-internet)  
> [Cron functions on AWS Lambda - Bref](https://bref.sh/docs/function/cron.html)  

## ER図

Laravelでは初めから様々なマイグレーションファイルが用意されています。それらを含めて自動的に生成されたER図は以下のようになりました。  

![ER_diagram](https://raw.githubusercontent.com/zuka-e/images/miwataru/Miwataru/erd.svg)

上記の図の内、今回のAPIのために作成したのは`users`と繋がっている部分です。タスクを`task_cards` (カード) という最小単位で扱い、それらの集合が`task_lists` (リスト) となり、`task_board` (ボード) は複数のリストを持つという関係になっており、またそれぞれが`users`に所属しています。  

尚、ER図の作成には、MySQL Workbenchというツールを用いています。

### MySQL Workbench

[MySQL Workbench](https://www.mysql.com/jp/products/workbench/)とは、GUIでデータベースの作成や操作などを行うことができるツールです。機能の一つとして、既存のデータベースの情報を用いてER図を出力することができます。  

ER図を作成するにあたって問題に思ったのは、データベースとの不整合が発生する恐れがあることです。先述の通りLaravelにはデフォルトで用意されているデータベースが存在しており、自身で作成していないことから、それらは特に見落としが発生してしまうと考えました。  

そこでデータベースの情報からER図を作成する手段を探していた所で、MySQL Workbenchを利用する方法に辿り着き、これによって作成の手間を省きER図とデータベースの整合性を保つことが可能となりました。  

## 使用技術 (フロントエンド)

- [TypeScript](https://www.typescriptlang.org/) (4.2.4) - 開発言語、静的型付け
- [React](https://reactjs.org) (17.0.2) - SPA構築ライブラリ
- [React Router Dom](https://reactrouter.com/web/guides/quick-start) (5.2.0) - ルーティング
- [React Helmet Async](https://github.com/staylor/react-helmet-async) (1.0.9) - HTMLタグ更新
- [Redux](https://redux.js.org) (4.1.0) - 状態管理
- [React Redux](https://react-redux.js.org) (7.2.4) - 状態管理 (Reactバインディング)
- [Redux Toolkit](https://redux-toolkit.js.org) (1.5.1) - 状態管理 (Redux簡便化ツール)
- [Marerial-UI](https://material-ui.com) (4.11.4) - UIデザインツール
- [Axios](https://github.com/axios/axios) (0.21.1) - HTTPクライアント
- [React Hook Form](https://react-hook-form.com/) (7.6.5) - フォーム
- [Yup](https://github.com/jquense/yup) (0.32.9) - スキーマ構築 (バリデーション)
- [React DnD](https://react-dnd.github.io/react-dnd/about) (14.0.2) - ドラッグ&ドロップ
- [Jest](https://jestjs.io/ja) (27.0.4) - テスト
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) (27.0.4)  - UIテスト
- [Mock Service Worker](https://mswjs.io) (0.28.2) - APIモック
- [markdown-to-jsx](https://github.com/probablyup/markdown-to-jsx) (7.1.3) - Markdown

## 使用技術 (バックエンド)

- PHP (8.0.5) - 開発言語
- [Laravel](https://laravel.com/) (8.32.1) - Webアプリケーションフレームワーク
- [MySQL](https://www.mysql.com/) (8.0.23) - RDB (開発環境)
- [Redis](https://redis.io/) (6.0.10) - キャッシュ、セッションストア (開発環境)
- [MailHog](https://github.com/mailhog/MailHog) - メール送受信 (開発環境)
- [PHPUnit](https://phpunit.de/) (9.5.2) - テスト
- [Telescope](https://laravel.com/docs/8.x/telescope) (4.4.6) - デバッガー
- [Sanctum](https://laravel.com/docs/8.x/sanctum) (2.9.3) - SPA認証 (セッション、CSRF & XSS 防衛)
- [Fortify](https://laravel.com/docs/8.x/fortify) (1.7.8) - 認証用バックエンド (ルーティング、コントローラー etc)
- [Bref](https://bref.sh/) (1.2.10) - PHP用Lambdaデプロイツール
- [Serverless](https://www.serverless.com/) (2.53.1) - サーバレスアプリケーション構成管理
- [AWS SDK for PHP](https://aws.amazon.com/sdk-for-php/) (3.188.0) - AWS連携

## 使用技術 (その他)

- [Docker](https://docs.docker.com/desktop/mac/release-notes/) - コンテナ管理
- [GitHub Actions](https://docs.github.com/actions) - CI/CD

## 画面

### ホーム

![home_page](https://raw.githubusercontent.com/zuka-e/images/miwataru/Miwataru/home_page.jpg)

---

### ログイン

| 入力時バリデーション | 送信時バリデーション |
| -- | -- |
| ![login_input_validation](https://raw.githubusercontent.com/zuka-e/images/miwataru/Miwataru/login_input_validation.jpg) | ![login_submit_validation](https://raw.githubusercontent.com/zuka-e/images/miwataru/Miwataru/login_submit_validation.jpg) |

---

### ユーザー登録

| 入力時バリデーション | 送信時バリデーション |
| -- | -- |
| ![register_input_validation](https://raw.githubusercontent.com/zuka-e/images/miwataru/Miwataru/register_input_validation.jpg) | ![register_submit_validation](https://raw.githubusercontent.com/zuka-e/images/miwataru/Miwataru/register_submit_validation.jpg) |

---

### マイページ

![mypage](https://raw.githubusercontent.com/zuka-e/images/miwataru/Miwataru/mypage.jpg)

---

### メールアドレス認証

#### 認証確認通知

![verification_notification](https://raw.githubusercontent.com/zuka-e/images/miwataru/Miwataru/verification_notification.jpg)

---

#### 認証用メール

![verification_email](https://raw.githubusercontent.com/zuka-e/images/miwataru/Miwataru/verification_email.jpg)

---

#### 未認証警告+再送信ボタン (マイページ)

![verification_warning](https://raw.githubusercontent.com/zuka-e/images/miwataru/Miwataru/verification_warning.jpg)

---

### パスワードリセット

#### 再設定リクエスト

| 入力時バリデーション | 送信時バリデーション |
| -- | -- |
| ![password_reset_input_validation](https://raw.githubusercontent.com/zuka-e/images/miwataru/Miwataru/password_reset_input_validation.jpg) | ![password_reset_submit_validation](https://raw.githubusercontent.com/zuka-e/images/miwataru/Miwataru/password_reset_submit_validation.jpg) |

---

#### 再設定用メール

![password_reset_email](https://raw.githubusercontent.com/zuka-e/images/miwataru/Miwataru/password_reset_email.jpg)

---

### ボードCRUD

![password_reset_email](https://raw.githubusercontent.com/zuka-e/images/miwataru/Miwataru/board_crud.gif)

---

### リストCRUD

![password_reset_email](https://raw.githubusercontent.com/zuka-e/images/miwataru/Miwataru/list_crud.gif)

---

### カードCRUD

![password_reset_email](https://raw.githubusercontent.com/zuka-e/images/miwataru/Miwataru/card_crud.gif)

---

### 絞り込み

![password_reset_email](https://raw.githubusercontent.com/zuka-e/images/miwataru/Miwataru/filter.gif)

---

### 並び替え

![password_reset_email](https://raw.githubusercontent.com/zuka-e/images/miwataru/Miwataru/sort.gif)

---

### 検索

![password_reset_email](https://raw.githubusercontent.com/zuka-e/images/miwataru/Miwataru/search.gif)

---

## 各種リンク

- アプリケーション: [https://www.miwataru.com/](https://www.miwataru.com/)
- フロントエンド実装過程: [https://github.com/zuka-e/laravel-react-task-spa/blob/development/frontend/README.md](https://github.com/zuka-e/laravel-react-task-spa/blob/development/frontend/README.md)
- バックエンド実装過程: [https://github.com/zuka-e/laravel-react-task-spa/blob/development/backend/README.md](https://github.com/zuka-e/laravel-react-task-spa/blob/development/backend/README.md)
