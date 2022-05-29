# 【Laravel 8 / Sail / Fortify / Sanctum】 タスク管理アプリ (ポートフォリオ) の実装過程 (バックエンド編)

主にスキル向上を目的に、ポートフォリオとしてタスク管理アプリを作成しました。このページでは、主にそのバックエンド部分の実装過程について触れていきます。  

アプリケーションや作成したコード、フロントエンドの実装過程の説明については、以下のリンクからアクセスできます。  

- アプリケーション: ~~[https://www.miwataru.com/](https://www.miwataru.com/)~~
- GitHub: [https://github.com/zuka-e/laravel-react-task-spa](https://github.com/zuka-e/laravel-react-task-spa)
- 全体像: [https://github.com/zuka-e/laravel-react-task-spa/blob/development/README.md](https://github.com/zuka-e/laravel-react-task-spa/blob/development/README.md)
- フロントエンド実装過程: [https://github.com/zuka-e/laravel-react-task-spa/blob/development/frontend/README.md](https://github.com/zuka-e/laravel-react-task-spa/blob/development/frontend/README.md)

## 目次

- [開発環境](#開発環境)
- [主要使用技術](#主要使用技術)
- [Laravel 8](#laravel-8)
- [Laravel Sail](#laravel-sail)
  - [同時起動サービス](#同時起動サービス)
  - [`sail`コマンド](#sailコマンド)
- [Laravel Debugbar](#laravel-debugbar)
- [Telescope](#telescope)
- [タイムゾーン/ロケール](#タイムゾーンロケール)
- [リソース](#リソース)
  - [マイグレーション](#マイグレーション)
  - [モデル](#モデル)
  - [Seeder/Factory](#seederfactory)
  - [ルーティング](#ルーティング)
  - [ミドルウェア](#ミドルウェア)
  - [コントローラー](#コントローラー)
  - [ページネーション](#ページネーション)
  - [テスト](#テスト)
- [GitHub Actions](#github-actions)
  - [GitHubホストランナー](#githubホストランナー)
  - [ワークフロー作成](#ワークフロー作成)
  - [データベースコンテナ](#データベースコンテナ)
  - [依存関係キャッシュ](#依存関係キャッシュ)
  - [ワークフロー完成形](#ワークフロー完成形)
- [認証](#認証)
  - [Fortify](#fortify)
  - [Sanctum](#sanctum)
    - [認証方式](#認証方式)
    - [認証ルーティング](#認証ルーティング)
    - [ログインリクエスト](#ログインリクエスト)
    - [CSRFトークン](#csrfトークン)
  - [CORS](#cors)
    - [`Access-Control-Allow-Origin`](#access-control-allow-origin)
    - [プリフライトリクエスト](#プリフライトリクエスト)
    - [`Access-Control-Allow-Credentials`](#access-control-allow-credentials)
    - [Domain属性](#domain属性)
- [まとめ](#まとめ)
- [各種リンク](#各種リンク)

## 開発環境

バックエンドの開発言語には**PHP**、Webアプリケーションフレームワークには**Laravel**を利用しました。開発環境の構築には、Laravelから公式に提供されている**Laravel Sail**を用いており、これを実行することで開発用のサーバーが起動し、データベースやセッションストアの他、メール送信まで行うことができる環境が整います。  

Laravel Sailにデフォルトで用意されている環境はカスタマイズすることも可能ですが、今回は特に変更を行っておらず、構築した環境は以下のようなものです。  

- [Docker for Mac](https://docs.docker.com/desktop/mac/release-notes/) (3.6.0)
- [Laravel Sail](https://laravel.com/docs/8.x/sail) (1.4.7)
  - PHP (8.0.5)
  - [Laravel](https://laravel.com/) (8.32.1)
  - [MySQL](https://www.mysql.com/) (8.0.23) - RDB
  - [Redis](https://redis.io/) (6.0.10) - キャッシュ、セッションストア
  - [MailHog](https://github.com/mailhog/MailHog) - メール送受信

バージョンが異なる場合、実装方法や依存ライブラリなども大きく異なることがあるので、ここでは**Laravel 8.x**であることを前提とします。  

## 主要使用技術

主に使用した技術、パッケージを以下に列挙します。(括弧内の数字はバージョン)  

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

## Laravel 8

**Laravel 8.x**では環境構築の方法が従来のものよりさらに容易になっています。以前は必要とされた手順であるComposerの導入やLaravelプロジェクトの作成、またデータベースのインストールや接続設定などが不要になり、それらを意識することなく開発準備を整えることができます。  

## Laravel Sail

簡単に環境構築を行うためには、**Laravel Sail**と呼ばれるものを使用します。これは[公式サイトで紹介されている](https://laravel.com/docs/8.x/installation#your-first-laravel-project)パッケージの一つです。前提としてDockerを使った構築方法になっているので、事前にDockerが利用できる環境が必要です。macOSであれば、Homebrewを利用したインストールが簡単です。  

```bash
brew install --cask Docker # インストール
open /Applications/Docker.app # 起動
```

下記に以前の方法の一例とLaravel Sail を利用した場合の比較を行っていますが、かなり簡潔になっていることがわかります。  

```bash
# 従来のインストール方法の例 (example-appは任意のプロジェクト名)

curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
composer global require laravel/installer
export PATH="$HOME/.config/composer/vendor/bin:$PATH"
laravel new example-app # バージョン指定する場合は下記のようになる
# composer create-project laravel/laravel example-app --prefer-dist "5.5.*"

# 次にデータベースの設定なども行う
```

```bash
# Laravel Sail を利用する方法 (example-appは任意のプロジェクト名)

curl -s https://laravel.build/example-app | bash
cd example-app && ./vendor/bin/sail up
```

上記のコマンドを実行すると端末上で起動していることが確認できます。ここには、MySQLなどのデータベースやRedisなどのインメモリデータベースも含まれています。  

このようにSailを利用することで、簡単にLaravelによるアプリケーションを実行できる上、データベースやキャッシュの他メールなどの事前設定も不要です。  

これらの設定については、プロジェクトルートに配置された、`docker-compose.yml`から確認できます。  

### 同時起動サービス

Laravel Sail を利用して環境構築する場合、実装時点のデフォルト設定では、MySQL, Redis, MeiliSearch, MailHog, Selenium のサービスが起動するようになっていました。しかし、代わりにPostgreSQLを利用する場合やRedisが不要といった場合は、それをインストール時に指定することができます。その場合はコマンドを以下のように変更し、`mysql`, `pgsql`, `redis`, `memcached`, `meilisearch`, `selenium`,  `mailhog`の中からサービスを指定します。  

```bash
curl -s "https://laravel.build/example-app?with=mysql,redis" | bash
```

このように、Laravel Sailを利用することによって、簡単にDocker環境でLaravelを利用した開発を始めることができるようになりました。  

> 参考： [Installation - Laravel # Choosing Your Sail Services](https://laravel.com/docs/8.x/installation#choosing-your-sail-services)  

### `sail`コマンド

上で使用している`./vendor/bin/sail`は、Laravel Sail によって利用することができるようになったコマンドで、`docker-compose`コマンドと同様の利用法が可能ですが、さらに`./vendor/bin/sail mysql`や`./vendor/bin/sail bash`など、短縮コマンドも用意されており幅広い使い方が可能です。頻繁に利用するので入力の手間を省くため[公式と同じように](https://laravel.com/docs/8.x/sail#configuring-a-bash-alias)エイリアスを設定しておきます。  

```bash
alias sail='bash vendor/bin/sail' # ~/.bashrc などに追記する
```

Laravelを利用する環境は概ね完了したので、次に設定の変更やツールの導入を行っていきます。  

## Laravel Debugbar

デバッガーは、アプリケーションの状態の把握の目的や、エラーが発生したときに速やかに原因を特定するために導入が必須と言えます。  

そのためのツールとして[Laravel Debugbar](https://github.com/barryvdh/laravel-debugbar)を利用する方法が考えられます。これはインストールするだけでセッションやリクエスト情報等をブラウザ上で確認することができるものです。  

しかし、SPAとして実装を進める場合、ブラウザで立ち上げているのはLaravelではなく、主にフロントエンドのアプリケーションとなるので今回の場合は用途に合致しないようです。そこで、次に言及するTelescopeを代わりに導入することにします。  

## Telescope

[Telescope](https://laravel.com/docs/8.x/telescope)とは、Laravel公式サイトでパッケージとして紹介されているデバッガーです。 これによってリクエストのあらゆる情報が記録され、それをブラウザで確認することができます。取得される情報はヘッダーやセッションの他クエリやキャッシュまで非常に広範囲にわたります。  

> Telescope provides insight into the requests coming into your application, exceptions, log entries, database queries, queued jobs, mail, notifications, cache operations, scheduled tasks, variable dumps, and more.  
>
> [Laravel Telescope - Laravel # Introduction](https://laravel.com/docs/8.x/telescope#introduction)  

インストールは以下のコマンドによって行います。  

```bash
sail composer require laravel/telescope --dev # --dev: 開発環境でのみ利用する場合
sail artisan telescope:install # CSSなどアセットファイルの出力
sail artisan migrate # 記録データ格納用テーブルの作成
```

`sail artisan route:list`を実行してルートを確認すると、Telescope関連のものが追加されており、[http://localhost/telescope](http://localhost/telescope)にアクセスすることでダッシュボードを確認することができます。  

## タイムゾーン/ロケール

日本語や日本時間を利用する指定を行うため、設定ファイルの`app/config/app.php`を以下のように修正します。  

```php :app/config/app.php
<?php

return [
    // ...
    'timezone' => 'Asia/Tokyo',

    'locale' => 'jp',

    'faker_locale' => 'ja_JP',
    // ...
];
```

上記の`faker_locale`とは、テストデータ生成用の[Faker](https://github.com/FakerPHP/Faker)を利用する際の設定です。ただし、この設定を行ったとしても多くは日本語を利用できません。これはデータが用意されていないためです。

> 参考： [Installation - Laravel # Initial Configuration](https://laravel.com/docs/8.x/installation#initial-configuration)  

## リソース

Laravelでは、アプリケーションに一般的に必要なファイル (リソース) がコマンド一つで一気に生成可能です。  

```bash
sail artisan make:model TaskCard --all --api
```

上記コマンドの`--all`オプションによって、`model`と同時に、 `migration`, `seeder`, `factory`, `controller`のファイルが生成されます。また`--api`オプションの指定をすることで、`controller`に、`index`や`store`などの、APIに必要なアクションが追加された状態となります。その他利用可能なオプションは`--help`を指定することで確認できます。  

```bash
php artisan make:model --help
```

### マイグレーション

リソース生成によって出力されたファイルの内、マイグレーション`database/migrations/{時刻}_create_task_cards_table.php`を以下のように書き換えます。  

```php :database/migrations/時刻_create_task_cards_table.php
public function up()
{
    Schema::create('task_cards', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')
            ->constrained() // 外部キー制約
            ->onUpdate('cascade')
            ->onDelete('cascade');
        $table->string('title', 191);
        $table->text('content')->nullable(); // null許容
        $table->boolean('done')->default(false); // 初期値設定
        $table->timestamps();
    });
}
```

まず`users`テーブルとの外部キー制約の設定を行います。上記のような記述によって、参照整合性を保つことが可能です。即ち、`user_id`が参照している`users`テーブルの`id`が変更された場合には当該テーブルの`user_id`の値も連動し、`users`テーブルの`id`が削除された場合には参照元である`task_cards`のレコードも同時に削除されされることになります。  

次に、`title`や`content`などの型を指定して作成するタスクに必要なカラムの設定を行っています。このとき要件によって、null許容やデフォルト値も設定します。  

> 参考：  
> [Database: Migrations - Laravel # Foreign Key Constraints](https://laravel.com/docs/8.x/migrations#foreign-key-constraints)  
> [Database: Migrations - Laravel # Available Column Types](https://laravel.com/docs/8.x/migrations#available-column-types)  
> [Database: Migrations - Laravel # Column Modifiers](https://laravel.com/docs/8.x/migrations#column-modifiers)  

### モデル

リソース生成によって出力されたファイルの内、次にモデルを変更していきます。  

始めに`$fillable`プロパティに、アプリ上で変更できるカラムを指定します。これはユーザーの通常の操作によって変更可能かを決定するもので、一般的に`id`や`created_at`(timestamps) などは含めません。  

次にリレーションを設定します。今回作成するのは、一人の`User`が`TaskCard`を複数持つことができる一対多の関係です。それには`user`プロパティを作成し、`belongsTo`メソッドを追加することで実現します。  

```php :app/Models/TaskCard.php
class TaskCard extends Model
{
    use HasFactory;

    // アプリ上の操作で変更可能にしたいカラムを追加
    protected $fillable = [
        'title',
        'content',
        'done'
    ];

    // リレーション設定
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

一方、`User`モデル側も編集し、`taskCards`プロパティに`hasMany`メソッドを追加します。  

```php :app/Models/User.php
public function taskCards()
{
    return $this->hasMany(TaskCard::class);
}
```

このようにすることで、互いのモデルに容易にアクセスできるようになります。  

```php
// `id`が`1`である`User`が持つ`TaskCard`を取得
$task_cards = App\Models\User::find(1)->task_cards;

// `id`が`1`である`TaskCard`が属する`User`を取得
$user = App\Models\TaskCard::find(1)->user;
```

> 参考： [Eloquent: Relationships - Laravel](https://laravel.com/docs/8.x/eloquent-relationships)  

データをブラウザに返却する際、必ずしも全てのカラムが必要ではなく、寧ろ`password`などのように秘匿した方が好ましいものもあります。そのような場合はモデルの`$hidden`プロパティにカラム名を追加します。  

```php :app/Models/TaskCard.php
protected $hidden = [
    'user_id',
];
```

また、データ返却時に値の表示方法を変更したい場合もあります。例えば、`Boolean`型のカラムは値が`0`と`1`で表されます。これをそれぞれ、`false`と`true`にするには`$cast`プロパティにカラムとそのキャストタイプを指定します。  

```php :app/Models/TaskCard.php
protected $casts = [
    'done' => 'boolean',
];
```

> 参考： [Eloquent: Mutators & Casting - Laravel # Attribute Casting](https://laravel.com/docs/8.x/eloquent-mutators#attribute-casting)  

### Seeder/Factory

動作確認用にテスト用のデータがあると便利です。Laravelでは簡単にそのようなデータを作成することができる機能が内包されています。それを利用するには、`database/factories`ディレクトリに生成された`TaskCardFactory.php`の`definition`メソッドにどのようなデータを生成するかを定義します。  

```php :database/factories/TaskCardFactory.php
public function definition()
{
    return [
        'title' => $this->faker->jobTitle,
        'content' => $this->faker->sentence,
    ];
}
```

上記のように、`faker`プロパティを通すことで、Laravelに備えられている[Faker](https://github.com/FakerPHP/Faker)ライブラリにアクセスし、事前に用意されたデータをランダムに生成することができるようになります。  

次に、`database/seeders/TaskCardSeeder.php`の`run`メソッドに、データベースに対する処理を追加します。  

```php :database/seeders/TaskCardSeeder.php
public function run()
{
    // 作成する`TaskCard`が属する`User`を事前に作成
    $user = User::factory()->create();

    // 'User'に属するデータを10件生成
    TaskCard::factory()->count(10)->for($user)->create();
}
```

上の処理では、まず`User`データを作成しています。`User`に属していない`TaskCard`は許容していないため、そのためのデータが必要となります。そして、その`User`に属するデータを10件生成するという処理を記述しています。  

実際にデータ作成処理を走らせるには以下`artisan`コマンドを実行します。  

```bash
sail artisan db:seed --class=TaskCardSeeder # Seederを指定してデータを生成
```

データベースを確認するとデータは作成できていますが、以上のような方法だとテーブルが増えてきたときには面倒になります。よってこれを統合するため、`database/seeders/DatabaseSeeder.php`の内容を以下のように変更します。  

```php :database/seeders/DatabaseSeeder.php
public function run()
{
    $this->call(TaskCardSeeder::class);
}
```

このように記述することで、Seederを指定することなく実行可能です。  

```bash
sail artisan db:seed
```

このように、リレーションのあるデータでも簡潔なコードで即座に大量のデータを生成できることが確認できました。  

> 参考：  
> [Database Testing - Laravel # Defining Model Factories](https://laravel.com/docs/8.x/database-testing#defining-model-factories)  
> [Database: Seeding - Laravel](https://laravel.com/docs/8.x/seeding)  

### ルーティング

データを準備が整ったのでここからはAPIとして利用できるように実装していきます。

まずは、データベースからデータを読み取ることから始めていきます。これはさらに"一覧"と"詳細"に分解でき、Laravelではそれぞれ`index`アクションと`show`アクションに分類されます。基本的に"詳細"はデータベースでの個別のレコードを表し、"一覧"はそれ以外 (複数のレコード) を表します。  

始めに行うことはルーティングの設定です。ここでは、ルートにアクセスしたときに全ての`task_cards`を表示するケースを想定し、`routes/api.php`に設定を記述していきます。  

```php :routes/api.php
Route::group([
    'namespace' => 'App\Http\Controllers',
    'prefix' => 'v1',
], function () {
    Route::apiResource('users.task_cards', TaskCardController::class)
        ->only('index');
});
```

`group`メソッドを利用することで共通する処理をまとめることが可能で、この第一引数には共有する機能、第二引数にはルート定義を指定しています。  

`namespace`には`Controller`ファイルが設置されている場所を指定します。これによって、`Controller`を記述するときに毎回先頭に付与する必要がなくなります。  

これは、Laravel 8における変更点の一つで、以前はアプリケーション側で用意されていました。ただし従来の方法で`namespace`を指定することも可能です。  

> 参考：
> [Release Notes - Laravel # Routing Namespace Updates](https://laravel.com/docs/8.x/releases#routing-namespace-updates)  

`prefix`には`v1`としていますが、これはバージョンを表しておりAPI開発の際に一般的にこのように表記が利用されるようです。  

次にルート定義で、`apiResource`メソッドの第一引数にはテーブル名を、第二引数にはコントローラーを指定します。これだけでAPIにおけるCRUD機能に必要なURIやアクションの割り当てが完了です。リレーションを表すために階層のあるルートを作成したいときは`users.task_cards`のようにドット (`.`) で結合します。結果を`sail artisan route:list`にて確認すると以下のようなルートが生成されていました。  

| HTTPメソッド | URI (`{user}`は`User`の`id`)| アクション
| -- | -- | -- |
| GET | /api/v1/users/{user}/task_cards | index
| GET | /api/v1/users/{user}/task_cards/create | create
| POST | /api/v1/users/{user}/task_cards | store
| GET | /api/v1/users/{user}/task_cards/{task_card} | show
| GET | /api/v1/users/{user}/task_cards/{task_card}/edit | edit
| PUT/PATCH | /api/v1/users/{user}/task_cards/{task_card} | update
| DELETE | /api/v1/users/{user}/task_cards/{task_card} | destroy

ルート定義時に`only`メソッドを使用することでその他のルートの出力を停止することができ、上記のコードでは`index`アクションのみを指定しています。  

結局、ルート定義としては、`api/v1/users/{user}/task_cards`にGETメソッドでアクセスしたとき`TaskCardController`の`index`アクションを実行するというものになりました。  

> 参考： [Controllers - Laravel # Resource Controllers](https://laravel.com/docs/8.x/controllers#api-resource-routes)  

`routes`ディレクトリには、`web.php`もありこちらにルーティングを設定することもできますが、今回はAPIとして利用するため、`api.php`の方に記述します。  

両者の違いは主に二つあり、１つはデフォルトのパスの違いです。`api.php`でルーティングを行うとパスの先頭に`api`が付与され、例えば`localhost/api/users`のようになります。２つ目の違いは適用されるミドルウェア ([後述](#ミドルウェア)) です。  

これら設定は`app/Providers/RouteServiceProvider.php`にて確認が可能です。  

```php :app/Providers/RouteServiceProvider.php
public function boot()
{
    $this->configureRateLimiting();

    $this->routes(function () {
        Route::prefix('api') // パスの設定
            ->middleware('api') // 適用するミドルウェア
            ->namespace($this->namespace)
            ->group(base_path('routes/api.php')); // 適用するファイル

        Route::middleware('web')
            ->namespace($this->namespace)
            ->group(base_path('routes/web.php'));
    });
}
```

> 参考： [Routing - Laravel](https://laravel.com/docs/8.x/routing)  

### ミドルウェア

ここでミドルウェアとは、HTTPリクエストを検査しフィルタリングなど何らかの操作を行う役割を果たすものを指します。  

上のファイルの中で、`middleware`メソッドによって適用するミドルウェアを決定しています。引数となっている`api`及び`web`はミドルウェアグループと呼ばれるもので、複数のミドルウェアをグループ化して一括で設定するものです。それぞれどのようなミドルウェアが属しているのかについては`app/Http/Kernel.php`に記述があります。  

```php :app/Http/Kernel.php
protected $middlewareGroups = [
    'web' => [
        \App\Http\Middleware\EncryptCookies::class,
        \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
        \Illuminate\Session\Middleware\StartSession::class,
        // \Illuminate\Session\Middleware\AuthenticateSession::class,
        \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        \App\Http\Middleware\VerifyCsrfToken::class,
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],

    'api' => [
        'throttle:api',
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],
];
```

このように、`web`と`api`では属しているミドルウェアが異なるため、それぞれが割り当てられている`web.php`と`api.php`では適用されるミドルウェアに違いがあります。  

> 参考： [Middleware - Laravel](https://laravel.com/docs/8.x/middleware)  

### コントローラー

タスクの一覧を表示させるため、先のルーティング設定で確認したように、`TaskCardController`の`index`アクションを実装していきます。APIとして利用する場合は、"View"の代わりにJSON形式のデータを返却することに注意して以下のように記述します。  

```php :app/Http/Controllers/TaskCardController.php
namespace App\Http\Controllers;

use App\Models\TaskCard;
use App\Models\User; // 追記
use Illuminate\Http\Request;

class TaskCardController extends Controller
{
    public function index(User $user) // 引数追記
    {
        // JSONとして返却
        return $user->taskCards; // 追記
    }
// ...
```

上の処理で、`$user`が持つ`task_cards`レコードを全て取得し、JSON形式として返却します。  
変数`$user`には、`users`テーブルから`id`で検索されたデータが自動的に入ります。引数に型ヒント (ここでは`$user`前の`User`) を行うことで実現するこの手法を、依存性注入 (DI) と呼びます。  

> 参考： [Controllers - Laravel # Dependency Injection & Controllers](https://laravel.com/docs/8.x/controllers#dependency-injection-and-controllers)  

次に利用している`taskCards`メソッドは、先述の[リレーション (Model)](#リレーション-model)の項目で設定したものです。  
そしてデータをJSONとして返却する点ですが、Laravelでは、コントローラーから返却する際には自動的にJSONに変換するため特別の操作は不要です。  

> Laravel will automatically serialize your Eloquent models and collections to JSON when they are returned from routes or controllers:  
>
> [Eloquent: Serialization - Laravel # Serializing To JSON](https://laravel.com/docs/8.x/eloquent-serialization#serializing-to-json)  

[Seeder & Factory](#seeder-and-factory)の項目でデータを生成していれば、[localhost/api/v1/users/1/task_cards](http://localhost/api/v1/users/1/task_cards)にアクセスすることで、`id`が`1`である`User`が持つ`TaskCard`のデータがJSON出力されていることが確認できるはずです。  

### ページネーション

取得するデータが非常に多い場合、データベースに負荷がかかり読み込みまで時間がかかることが予想されます。そのような場合にはページネーション機能を用いることで一定のデータ数に分割して取得することが可能です。  

Laravelではこれがデフォルトで利用できるようになっており、以下のように`paginate`メソッドを使用して取得データ数を指定します。  

```php :app/Http/Controllers/TaskCardController.php
namespace App\Http\Controllers;

use App\Models\TaskCard;
use App\Models\User;
use Illuminate\Http\Request;

class TaskCardController extends Controller
{
    public function index(User $user)
    {
        // 一度に取得するデータ数を20とする
        return TaskCard::where('user_id', $user->id)->paginate(20);
    }
// ...
```

> 参考：[Database: Pagination - Laravel](https://laravel.com/docs/8.x/pagination)  

### テスト

これまでの実装をテストによって確認してみます。現段階ではブラウザでリクエストを送って期待通りのレスポンスが返ってくることは確認済みですが、他の機能を実装する過程でこれが崩れてしまうこともあり、そのとき毎回手動で確認するには多くの手間が発生します。そこでテストコードを作成することで問題の解決を目指します。  

Laravelにおいては、初めからテストに必要なライブラリである**PHPUnit**及び設定ファイルの`phpunit.xml`、また`tests`ディレクトリに初期ファイルが用意されており、すぐにテストを開始することができます。そこで今、`sail artisan test`を実行すると、`tests`ディレクトリ以下の`Unit`及び`Feature`ディレクトリに置かれている`Test.php`で終わるファイルのテストが走ります。  

このファイル名などのルールは、`phpunit.xml`に規定されているものです。同様に、テストの実行環境が`testing`になることも定められています。即ち、`.env.testing`ファイルを用意することで普段と異なる環境で利用できるということです。  

ただし注意点として、ファイルが存在しない場合は`.env`の値が用いられます。その場合データベースも同じものを使用しているので、これまでに作成したデータが削除されたり想定外のテスト結果となってしまったりすることがあります。  

> 参考：[Testing: Getting Started - Laravel # Environment](https://laravel.com/docs/8.x/testing#environment)  

それでは以下のコマンドを実行して実際にテストを作成してみます。`--unit`オプションを付けない場合、`Feature`ディレクトリにファイルが生成されます。  

```bash
php artisan make:test TaskCardTest
```

以下ではページネーションによってデータ取得数が`20`になっていることをテストしています。  

```php :tests/Feature/TaskCardTest.php
<?php

namespace Tests\Feature;

use App\Models\TaskCard; // 追加
use App\Models\User; // 追加
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TaskCardTest extends TestCase
{
    use RefreshDatabase; // DBリフレッシュ

    // テストの前に実行する処理を追加
    public function setUp(): void
    {
        parent::setUp(); // 必須

        $user = User::factory()->create(['id' => 1]); // TaskCardが属するUser
        TaskCard::factory()->count(21)->for($user)->create();
    }

    public function test_20_items_in_one_page()
    {
        $response = $this->get('/api/v1/users/1/task_cards');
        $response->assertJson(
            fn (AssertableJson $json) =>
            $json->has('data', 20)
        );
    }
}
```

まず、それぞれのテストで相互依存を避けるべくデータが存在しない状態で開始させるため、`use RefreshDatabase`によってデータベースをリフレッシュする処理を先頭に置いています。  

次に、`setUp`メソッドでテストに実行したい処理を追加します。ここでは複数のテストで共通で使用するデータの生成などを行います。  

そして、テスト処理ではまず`get`メソッドで該当ページへリクエストを送ります。次にそのレスポンスが`data`キーを持っていてそのバリュー数が`20`であることをテストします。  

テストの実行には、`sail artisan test`を使用し、成功すれば`PASS`と出力されます。  

> 参考： [HTTP Tests - Laravel # Scoping JSON Collection Assertions](https://laravel.com/docs/8.x/http-tests#scoping-json-collection-assertions)  

さらにテストを活用するため、[後](#github-actions)にGitHub Actionsを導入します。  

## GitHub Actions

**GitHub Actions** とは、事前に規定したイベントが発生した際に、自動的に任意のコマンドを実行することができるサービスです。イベントに指定可能なものとして、リポジトリへのPushやPull Request があり、特定のBranchの場合に限定するといった条件を指定することも可能です。また、イベント駆動に限らずスケジュールに従って実行することもできます。  

> 参考： [ワークフローをトリガーするイベント - GitHub Docs](https://docs.github.com/ja/actions/reference/events-that-trigger-workflows)  

GitHub Actions を導入することで、コードのビルドやテストの実行及びデプロイなどをイベントに従って自動で行うことができます。これによって、コードの変更による他の箇所への影響を早期に発見し対処することが可能となると同時に、このような頻繁に発生する定型業務を効率化しつつ強制することができます。  

ここでは、[Laravelにおけるテストの項目](#テスト-phpunit)でテストを作成したのでそれを利用します。また今回は、Push及びPull Request のタイミングで対象Branchは問わずに実行する例を示します。  

料金についてですが、**パブリックリポジトリでは無料**で利用することができます。一方プライベートリポジトリでは一定のリソース消費までは無料となります。GitHubの料金プランによってその範囲は異なりますが、現在は以下のような制限となっています。  

| 製品 | ストレージ | 利用時間 (分) / 月 |
|---|---|---|
| GitHub Free | 500 MB | 2,000 |

最新の料金体系については変更の可能性があるので、公式サイトを参照してください。  

> 参考： [GitHub Actionsの支払いについて - GitHub Docs](https://docs.github.com/ja/github/setting-up-and-managing-billing-and-payments-on-github/about-billing-for-github-actions)  

### GitHubホストランナー

GitHub Actions では、**GitHubホストランナー**と呼ばれる仮想環境が提供されており、定義したコマンドが実際に実行される場所はこのGitHubホストランナー上となります。よって、それに対応させるようにコマンドの調整が必要になります。しかし、一般的なユースケースはテンプレートとして用意されているのでそれに従うことで導入コストを抑えることができます。  

尚、上記の仮想環境ではなく独自で用意したホストを利用する方法もあります。  

> 参考：  
> [GitHubホストランナーについて - GitHub Docs](https://docs.github.com/ja/actions/using-github-hosted-runners/about-github-hosted-runners)  
> [セルフホストランナーについて - GitHub Docs](https://docs.github.com/ja/actions/hosting-your-own-runners/about-self-hosted-runners)  

### ワークフロー作成

GitHub Actions は導入から動作させるまでに特段の準備は必要ありません。リポジトリのルートに`.github/workflows`ディレクトリを作成し、その配下に設定やコマンドなどの手順 (**ワークフロー**) を記述したYAMLファイル を設置するだけです。このように導入が容易なことも利点の一つと言えます。  

このワークフローの作成においてもテンプレートを利用して簡単に始めることができます。次のGitHubリポジトリ [actions/starter-workflows: Accelerating new GitHub Actions workflows](https://github.com/actions/starter-workflows) に様々な言語でCI/CDに利用できるコードが提供されています。  

また、GitHubコミュニティによって作成されたものを利用することもでき、[GitHub Marketplace](https://github.com/marketplace?type=actions) からそれらにアクセスできます。  

今回の主な目的としてはテストを行うことです。即ち**PHPUnit**によるテスト実行コマンドを走らせることができればいいことになります。しかし、GitHubホストランナー上の環境はまだその準備ができていないので、初めにそれを整える必要があります。具体的には、`.env`ファイルの生成やパッケージインストールなどです。  

それも含めてワークフローを作成すると以下のようになります。  

```yml :test.yml
# 任意のワークフロー名
name: PHPUnit
# トリガーとなるイベント
on: [push, pull_request]

jobs:
  test: # 任意のジョブ名
    runs-on: ubuntu-latest # GitHubホストランナー
    defaults:
      run:
        # テストを実行するディレクトリ
        working-directory: ./backend
    steps:
      - name: Check out repository code # 任意のステップ名
        uses: actions/checkout@v2 # アクションの使用
      - name: Install Dependencies
        run: composer install -q --no-ansi --no-interaction --no-scripts --no-progress --prefer-dist
      - name: Generate APP_KEY
        run: php artisan key:generate --env=testing
      - name: Execute tests
        run: ./vendor/bin/phpunit
```

注意点として初めに`working-directory`に注目します。今回のリポジトリの構成としてルートに`backend`ディレクトリを作成し、そこにLaravelプロジェクトを構築しています。よってテストを実行すべき作業ディレクトリは相対パスで`./backend`となり、それを`working-directory`の値に指定する必要があります。  

YAML構文の最上位に`jobs`が来ています。これはワークフロー内のジョブ (ここでは`test`一つのみ) をまとめるものです。複数のジョブが存在する場合は並行実行します。また、ジョブは一連のステップ`steps`から構成され、そのステップにおいてはアクション`uses`またはシェルコマンド`run`を指定します。  

アクションには、上記の`actions`の他、[GitHub Marketplace](https://github.com/marketplace?type=actions) で提供されているものを利用することも可能ですが、`actions/checkout`は必ず必要です。  

> ワークフローがリポジトリのコードに対して実行されるとき、またはリポジトリで定義されたアクションを使用しているときはいつでも、チェックアウトアクションを使用する必要があります。  
>
> [GitHub Actions 入門 - GitHub Docs # ワークフローファイルを理解する](https://docs.github.com/ja/actions/learn-github-actions/introduction-to-github-actions#understanding-the-workflow-file)  

次に行っているのが依存関係のインストール (`Install Dependencies`) です。指定しているオプションは主に余計な出力を制限するためのものです。詳細は`sail composer install --help`でも確認できます。  

そしてアプリケーションキーの生成 (`Generate APP_KEY`) を行っていますが、ここでのポイントとしては、`.env`ファイル作成を行わない代わりに、`php artisan key:generate`実行時に`--env=testing`オプションを指定していることです。これにより、`.env.testing`に`APP_KEY`の値が生成されることになります。テスト (`phpunit`) 実行時に`.env.testing`が存在すればその値を参照するようになるため、`.env`は作成していません。  

> 参考：  
> [GitHub Actionsのワークフロー構文 - GitHub Docs](https://docs.github.com/ja/actions/reference/workflow-syntax-for-github-actions)  
> [Laravel workflow](https://github.com/actions/starter-workflows/blob/a3d822534a3d6467de0aba8563d4c7ee25b7a94c/ci/laravel.yml) - actions/starter-workflows/ci/laravel.yml - GitHub  

### データベースコンテナ

データベースを利用したテストを実行するため、事前にデータベースのサービスを起動する必要があります。今回は、MySQLのDockerコンテナを用いてこれを実現することにします。  

ワークフローに設定する内容としては以下のようになります。  

```yml :test.yml
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8.0
        ports:
          - 3306:3306
        env:
          MYSQL_DATABASE: backend
          MYSQL_ALLOW_EMPTY_PASSWORD: yes
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=5
```

このコンテナにアクセスするには上でマッピングしたポート`3306`と`DB_HOST`にローカルホストを指定します。ここで`localhost`ではなく`127.0.0.1`を利用することに注意が必要です。`localhost`を指定した場合、`SQLSTATE[HY000] [2002] No such file or directory`エラーが発生します。  

```yml :test.yml
- name: Execute tests
  env:
    DB_HOST: 127.0.0.1
  run: ./vendor/bin/phpunit
```

このアクセス情報が`.env.testing`ファイルに設定されていればコードは不要ですが、`DB_HOST`の値はローカル環境でテスト用データベースを使用するためにホスト名`mysql.test`を指定してしまっているのでこれに上書きが必要です。  

> 参考：  
> [PostgreSQLサービスコンテナの作成 - GitHub Docs  # ランナーマシン上で直接のジョブの実行](https://docs.github.com/ja/actions/guides/creating-postgresql-service-containers#running-jobs-directly-on-the-runner-machine)  
> [Workflow syntax for GitHub Actions - GitHub Docs](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idservices)  

### 依存関係キャッシュ

GitHub Actions では、毎回仮想環境内にアプリケーション実行環境をセットアップする必要があります。特に、Composerパッケージなどの依存関係を毎回ダウンロードしなければならないというのは、実行時間やネットワークIOなどの面で余計なコストが発生します。プライベートリポジトリでは利用時間の制限があるので、より考慮すべき問題となります。  

そこで依存関係をキャッシュしておき、これを次回以降利用することで環境構築を高速化することを目指します。  

ワークフローに追加するをコードとしては以下のようになります。  

```yml :.test.yml
- name: Cache Composer packages
  id: composer-cache # actions/cache@v2 に対して付与
  uses: actions/cache@v2
  with:
    path: ./backend/vendor # `vendor/autoload.php`を作成するため
    key: ${{ runner.os }}-composer-${{ hashFiles('**/composer.lock') }}
    restore-keys: |
      ${{ runner.os }}-composer-
- name: Install Dependencies
  if: steps.composer-cache.outputs.cache-hit != 'true' # キャッシュ存在すればスキップ
  run: composer install -q --no-ansi --no-interaction --no-scripts --no-progress --prefer-dist
```

基本的に参考サイトで提示されているテンプレートの流用ですが、相違点としては、キャッシュのパス`path`を`./backend/vendor`としていることです。これは依存パッケージを`vendor`配下に設置し、キャッシュが存在する場合にインストール処理をスキップするためです。  

他のディレクトリの指定では`vendor/autoload.php`が作成されず、`composer install`をスキップした場合にはそのファイルを要求する旨のエラーが発生します。  

```bash
PHP Fatal error:  Uncaught Error: Failed opening required '/home/runner/work/{リポジトリ名}/backend/vendor/autoload.php'
```

尚、`working-directory`に`./backend`を指定していましたが、ここではルートディレクトリからの相対パスまたは絶対パスを設定します。`working-directory`から見た`./vendor`ではないことに注意が必要です。  

> 参考：  
> [依存関係をキャッシュしてワークフローのスピードを上げる - GitHub Docs](https://docs.github.com/ja/actions/guides/caching-dependencies-to-speed-up-workflows)  
> [PHP - Composer](https://github.com/actions/cache/blob/main/examples.md#php---composer) - actions/cache/examples.md - GitHub  
> [Skipping steps based on cache-hit](https://github.com/actions/cache#Skipping-steps-based-on-cache-hit) - actions/cache - GitHub  
> [PHP workflow](https://github.com/actions/starter-workflows/blob/a3d822534a3d6467de0aba8563d4c7ee25b7a94c/ci/php.yml) - actions/starter-workflows/ci/php.yml - GitHub  

### ワークフロー完成形

かくして、以上の設定を組み合わせたワークフローは次のようになりました。  

```yml :test.yml
name: PHPUnit

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./backend

    services:
      db:
        image: mysql:8.0
        ports:
          - 3306:3306
        env:
          MYSQL_DATABASE: backend
          MYSQL_ALLOW_EMPTY_PASSWORD: yes
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=5

    steps:
      - name: Check out repository code
        uses: actions/checkout@v2

      - name: Cache Composer packages
        id: composer-cache
        uses: actions/cache@v2
        with:
          path: ./backend/vendor
          key: ${{ runner.os }}-composer-${{ hashFiles('**/composer.lock') }}
          restore-keys: |
            ${{ runner.os }}-composer-
      - name: Install Dependencies
        if: steps.composer-cache.outputs.cache-hit != 'true'
        run: composer install --no-interaction --prefer-dist
      - name: Generate APP_KEY
        run: php artisan key:generate --env=testing
      - name: Execute tests
        env:
          DB_HOST: 127.0.0.1
        run: ./vendor/bin/phpunit
```

このYAMLファイルがリポジトリのルートに設置されている`.github/workflows`ディレクトリに格納することで、以降のPush及びPull Request のタイミングでテストが実行され、その結果はリポジトリの"Actions"タブから確認することができるようになります。  

## 認証

Laravelで認証機能を実装する場合、選択肢が複数存在します。特に、[Breeze](https://laravel.com/docs/8.x/starter-kits#laravel-breeze)または[Jetstream](https://jetstream.laravel.com/2.x/introduction.html)のパッケージを用いた方法では、MVCの"View"にあたるUIも内包された状態で認証機能を導入することができます。ただ今回はこれを利用せず、**Fortify**と**Sanctum**という二つのパッケージを組み合わせて認証を実装します。  

前述のパッケージを利用しない理由の一つは、"View"の部分で対応しているのが基本的にVue.jsのみであるということです。学習済みである"React"を使用してさらに理解を深めることが目的でもあるので敬遠する要因となっています。その他パッケージ化されている分カスタマイズするには複雑になることも考えられます。一方、Fortifyを利用する場合にはUIは提供されていないので自由にフロントエンドを選ぶことが可能です。  

> If you are building a single-page application (SPA) that will be powered by a Laravel backend, you should use Laravel Sanctum. When using Sanctum, you will either need to manually implement your own backend authentication routes or utilize Laravel Fortify as a headless authentication backend service that provides routes and controllers for features such as registration, password reset, email verification, and more.  
>
> [Authentication - Laravel # Summary & Choosing Your Stack](https://laravel.com/docs/8.x/authentication#summary-choosing-your-stack)  

### Fortify

Fortifyとは、ログインやユーザー登録、メール認証など基本的な認証機能を提供するパッケージです。先述のBreezeやJetstreamは認証部分にこのFortifyを利用しています。  

Fortifyを導入することで、認証に必要なルーティングやコントローラーを用意することができます。これらは自前で実装することも可能ですが、複雑故に知識不足やコードの過不足によって脆弱性の存在を作り出してしまう原因にもなりえます。  

認証で実装する内容はアプリケーションによってそれほど違いはないことが多いため、認証についてはパッケージに任せるのが簡単で無難な方法です。  

Fortifyは初期状態では含まれていないので、初めにComposerパッケージからインストールを行います。  

```bash
sail composer require laravel/fortify
```

次に、アクションやコンフィグ、マイグレーションを出力するためのコマンドを実行します。  

```bash
php artisan vendor:publish --provider="Laravel\Fortify\FortifyServiceProvider"
```

次に、マイグレーションの内容をデータベースに反映させます。  

```bash
sail artisan migrate
```

最後に、`Fortify Service Provider`クラスを`config/app.php`に登録することで、アクションを有効化します。  

```php :config/app.php
App\Providers\FortifyServiceProvider::class,
```

Fortifyを利用するための準備が整ったので次に設定を変更していきます。  

まず、SPAの場合はログイン画面やユーザー登録画面のViewをバックエンドで提供する必要はないので、それらのルートを無効化するために設定ファイル`config/fortify.php`の`views`の値を`false`に切り替えます。  

```php :config/fortify.php
'views' => false,
```

次に、ルート名の先頭にこれまで同様の`api`を付与するために`prefix`を指定します。これにより、例えば元々`login`だったルートが`api/login`に変更されます。  

```php :config/fortify.php
'prefix' => 'api',
```

この時点で既に`config/fortify.php`の`features`で指定した機能が利用できるようになっており、データベースに存在するユーザー情報で`api/login`POSTリクエストを行うことでログインが可能です。  

しかし、別オリジンであるフロントエンドからのリクエストの場合は拒否されます。これを回避するためには後述の[CORS](#cors)及び[CSRFトークン](#csrfトークン)の設定に加えて認証パッケージ [Sanctum](#sanctum)の導入が必要となります。  

```php :config/fortify.php
'features' => [
    Features::registration(),
    Features::resetPasswords(),
    // Features::emailVerification(),
    Features::updateProfileInformation(),
    Features::updatePasswords(),
    Features::twoFactorAuthentication([
        'confirmPassword' => true,
    ]),
],

```

> 参考：  
> [Laravel Fortify - Laravel](https://laravel.com/docs/8.x/fortify)  
> [Laravel Fortify SPA Authentication with Laravel Sanctum without Jetstream - YouTube](https://www.youtube.com/watch?v=QYJKp1e71xs)  
> [Getting started with Laravel Fortify and Sanctum - YouTube](https://www.youtube.com/watch?v=W7owQcBYerA)  
> [Updates to the Laravel Fortify SPA Authentication, Improvements & Routes File Cleanup - YouTube](https://www.youtube.com/watch?v=2a2FFg40zFI)  

### Sanctum

Sanctumはアプリケーションに認証機能を提供するパッケージです。Fortifyと異なりこちらはルーティングやコントローラーでの処理は含まれておらず、リクエストの正当性を検証するための方法を提供します。  

> Laravel Sanctum is only concerned with managing API tokens and authenticating existing users using session cookies or tokens. Sanctum does not provide any routes that handle user registration, password reset, etc  
>
> [Laravel Fortify - Laravel # Laravel Fortify & Laravel Sanctum](https://laravel.com/docs/8.x/fortify#laravel-fortify-and-laravel-sanctum)  

先述のとおり、Fortifyを利用しない場合であっても代わりのコードを用意することは可能です。一方、Sanctumが提供する機能は、`Jetstream`などのパッケージを採用する場合を除いて、API認証を行う上で基本的に必要となります。  

#### 認証方式

認証の方法として、APIトークンを利用した認証とSPA認証という二つが用意されていますが、SPAのバックエンドとして用いる場合にはSPA認証の方を利用するべきとの記載があるのでそれに従います。これはAPIトークンの代わりにCookieとセッションを利用した認証方式です。  

> You should not use API tokens to authenticate your own first-party SPA. Instead, use Sanctum's built-in SPA authentication features.  
>
> [Laravel Sanctum - Laravel # API Token Authentication](https://laravel.com/docs/8.x/sanctum#api-token-authentication)  

SanctumはLaravelの初期状態に含まれていないので、初めにComposerパッケージからインストールを行います。  

```bash
sail composer require laravel/sanctum
```

次に、コンフィグ及びマイグレーションを出力します。  

```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

最後に、マイグレーションの内容をデータベースに反映させます。  

```bash
sail artisan migrate
```

Sanctumを利用するための準備が整ったので次に設定を変更していきます。  

まずフロントエンドでCookieを受け入れるようにするため、使用しているドメインを`config/sanctum.php`に追加します。利用している環境によって異なりますが、今回の場合は`localhost:3000`です。コンフィグでは環境変数を参照するようになっているので`.env`ファイルの方に記入します。  

```php :config/sanctum.php
/*
|--------------------------------------------------------------------------
| Stateful Domains
|--------------------------------------------------------------------------
|
| Requests from the following domains / hosts will receive stateful API
| authentication cookies. Typically, these should include your local
| and production domains which access your API via a frontend SPA.
|
*/

'stateful' => explode(',', env(
    'SANCTUM_STATEFUL_DOMAINS',
    'localhost,127.0.0.1,127.0.0.1:8000,::1'
)),
```

```bash :.env
SANCTUM_STATEFUL_DOMAINS=localhost:3000
```

加えて、`app/Http/Kernel.php`のミドルウェアグループ`api`に`EnsureFrontendRequestsAreStateful`を追加します。  

```php :app/Http/Kernel.php
protected $middlewareGroups = [
    'web' => [
        \App\Http\Middleware\EncryptCookies::class,
        \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
        \Illuminate\Session\Middleware\StartSession::class,
        // \Illuminate\Session\Middleware\AuthenticateSession::class,
        \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        \App\Http\Middleware\VerifyCsrfToken::class,
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],

    'api' => [
        \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class, // 追加
        'throttle:api',
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],
];
```

先述のように、Sanctumは、Cookieとセッションを利用した認証方式です。しかしデフォルトではミドルウェアグループ`api`に含まれていません。`EnsureFrontendRequestsAreStateful`はそれらの他必要なミドルウェアの代替も果たすものです。そして、上記の`SANCTUM_STATEFUL_DOMAINS`からのリクエストの場合にそれを有効にさせるようになっています。  

#### 認証ルーティング

アクセスにログインを必要とするルートを定義するには、`sanctum`"guard"を追加します。  

```php :routes/api.php
Route::middleware('auth:sanctum')
    ->apiResource('users.task_cards', TaskCardController::class)
    ->only('store');
```

これにより、未ログインの状態でこのルートにアクセスした場合には`401`エラーが発生します。  

#### ログインリクエスト

ログインを行うには設定済みのFortifyによって提供されるルート`api/login`にユーザー情報を持ったPOSTリクエストを送ります。[後述のCORSの設定](#cors)は完了済みとすると、Axiosを利用する場合フロントエンドのコードは例えば以下のようになります。  

```ts
apiClient.post('/api/login', {
    email: 'username@example.com',
    password: 'password'
}).then(response => {
    console.log(response)
})
```

このとき、`email`に'username@example.com'を持ち`password`の値が'password'である`User`が存在しない場合、`422`エラーが発生します。  

注意点として、データベースとの値と照合するときの`password`の値はハッシュ値であるということです。テストを行う際には、データ生成用の`UserFactory`における`password`の値がハッシュ化されていることを確認します。尚、デフォルトでは'password'のハッシュ値になっているようです。  

```php :database/factories/UserFactory.php
public function definition()
{
    return [
        'name' => $this->faker->name,
        'email' => $this->faker->unique()->safeEmail,
        'email_verified_at' => now(),
        'password' => Hash::make("password"), // 明示的なハッシュ化
        'remember_token' => Str::random(10),
    ];
}
```

まだCSRF保護機能への対応を行っていないため、このリクエストに対しては`419 (CSRF token mismatch)`エラーを返します。  

#### CSRFトークン

LaravelではセッションごとにCSRFトークンを生成し、リクエスト時にそれを検証することで正当なユーザーからのアクセスであることを確認しています。このCSRFトークンをCookie`XSRF-TOKEN`にセットする必要がありますが、そこで行うのが`sanctum/csrf-cookie`に対するGETリクエストです。このリクエストはログインリクエストの直前に行います。

```ts
apiClient.get('/sanctum/csrf-cookie').then(response => {
    apiClient.post('/api/login', {
        email: 'username@example.com',
        password: 'password'
    }).then(response => {
        console.log(response)
    })
});
```

CORSを利用するため、`config/cors.php`の`path`に`sanctum/csrf-cookie`の追加が必要です。([CORSの項](#cors)を参照)

```php :config/cors.php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
```

そして、リクエスト時にこの`XSRF-TOKEN`の値をヘッダー`X-XSRF-TOKEN`にセットすることを要しますが、フロントエンド側でリクエストに**Axiosを利用している場合には**この動作は自動的に行われます。  

Cookieが有効であり、`XSRF-TOKEN`の値が`X-XSRF-TOKEN`に入っていれば、その後のリクエストで`419`エラーは発生しなくなり成功します。  

尚、セッションの期限切れなどによって有効でなくなった場合には`401`又は`419`エラーが返されます。その場合再度ログインが必要となるので、フロントエンド側ではログインページにリダイレクトを行うなどの対応が求められます。  

> 参考：  
> [Authentication - Laravel](https://laravel.com/docs/8.x/authentication)  
> [CSRF Protection - Laravel](https://laravel.com/docs/8.x/csrf)  
> [Laravel Sanctum - Laravel](https://laravel.com/docs/8.x/sanctum)  
> [Using Sanctum to authenticate a React SPA | Laravel News](https://laravel-news.com/using-sanctum-to-authenticate-a-react-spa)  
> [Laravel Sanctum SPA Tutorial - React SPA Authentication With Sanctum - YouTube](https://www.youtube.com/watch?v=uPKd3q-iaVs)  
> [Getting started with Laravel Fortify and Sanctum - YouTube](https://www.youtube.com/watch?v=W7owQcBYerA)  

### CORS

異なるオリジン間でサーバーからのレスポンスを受け取るには、CORS (Cross-Origin Resource Sharing) の設定が必要になります。これはブラウザに備えられた同一オリジンポリシーの機能によって、他のオリジンのリソースにアクセス制限がかけられているためです。  

> 参考：  
> [オリジン間リソース共有 (CORS) - HTTP | MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS)  
> [同一オリジンポリシー - Web セキュリティ | MDN](https://developer.mozilla.org/ja/docs/Web/Security/Same-origin_policy)  
> [Using Sanctum to authenticate a React SPA | Laravel News - A digression on CORS](https://laravel-news.com/using-sanctum-to-authenticate-a-react-spa)  

#### `Access-Control-Allow-Origin`

CORSを有効化するには、まずレスポンスヘッダー`Access-Control-Allow-Origin`の値にフロントエンドで利用しているオリジン (ここでは`http://localhost:3000`) を指定する必要がありますが、Laravelでは、`config/cors.php`でそれを行います。  

現在の設定は以下のようになっており、許可されるオリジンの指定にはワイルドカードが使用されており任意の値を示している一方でパスの指定では制限がかけられています。  

```php :config/cors.php
'paths' => ['api/*', 'sanctum/csrf-cookie'], // CORSを許可するパス
// ...
'allowed_origins' => ['*'], // CORSを許可するオリジン
```

ルート設定で`routes/api.php`を利用しているので、リクエストは基本的に許可されるパス`api/*`に該当します。一方、Sanctumを利用する際に`sanctum/csrf-cookie`へのアクセスを行いますが、これは先頭が`api`でないため上記`paths`の配列に追加します。  

このヘッダーと、リクエスト側のヘッダーである`Origin`の値が一致してしる場合、CORSは有効に作用します。尚、この`Origin`はリクエストヘッダーに自動的に付与されるので特に設定の必要はありません。  

#### プリフライトリクエスト

CORSを利用するにあたって、ブラウザは本来のリクエストの前にそれが許可されているかをサーバーに問い合わせる目的で`OPTIONS`リクエストを送信します。これをプリフライトリクエストと呼びます。  

ここで前述の`config/cors.php`設定によってリクエストが許可されていれば、CORSポリシーによるブロックは解かれるようになります。  

#### `Access-Control-Allow-Credentials`

加えて、Cookieを利用したリクエストの場合にはレスポンスヘッダーに`Access-Control-Allow-Credentials`を`true`にして追加することも必要です。Laravelでそれを行うには、`config/cors.php`の`supports_credentials`を`true`に設定します。  

```php :config/cors.php
'supports_credentials' => true,
```

次に、リクエスト側でも上記に対応する設定が必要で、Axiosを利用する場合、`withCredentials`オプションを`true`にして追加します。  

```typescript
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost',
    withCredentials: true,
});

// 例： axios.get() の代わりに、apiClient.get() を使用
```

> 参考： [The Axios Instance | Axios Docs](https://axios-http.com/docs/instance/)  

#### Domain属性

Cookieに関して、上記に加えてもう一つ設定があります。それはCookieを受信することができるドメインを指定することです。そのためには`config/session.php`の`domein`の値を設定しますが、これはCookieのDomain属性を指定することに相当します。  

```php :config/session.php
'domain' => env('SESSION_DOMAIN', null),
```

これを指定していない場合はCookieを設定したのと同じオリジンになりますがサブドメインは除外されます。サブドメインでも利用する場合には以下のように先頭にドット(`.`)を用います。

```bash :.env
SESSION_DOMAIN=.domain.com
```

> 参考：  
> [Laravel Sanctum - Laravel # CORS & Cookies](https://laravel.com/docs/8.x/sanctum#cors-and-cookies)  
> [HTTP Cookie の使用 - HTTP | MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/Cookies)  

以上で、Cookieを利用したSPA認証を利用することができるようになりました。  

## まとめ

ここまでLaravel実装の中でも特に序盤で行う内容について説明してきました。今回はここまでとなりますが、まだ触れられていないことも多く存在するので折に触れて追記していきたいと思います。  

## 各種リンク

- アプリケーション: ~~[https://www.miwataru.com/](https://www.miwataru.com/)~~
- GitHub: [https://github.com/zuka-e/laravel-react-task-spa](https://github.com/zuka-e/laravel-react-task-spa)
- 全体像: [https://github.com/zuka-e/laravel-react-task-spa/blob/development/README.md](https://github.com/zuka-e/laravel-react-task-spa/blob/development/README.md)
- フロントエンド実装過程: [https://github.com/zuka-e/laravel-react-task-spa/blob/development/frontend/README.md](https://github.com/zuka-e/laravel-react-task-spa/blob/development/frontend/README.md)
