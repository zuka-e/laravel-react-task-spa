# Backend

## Laravel 8

**Laravel 8.x**では環境構築がこれまでよりさらに容易になっています。以前は必要だった、Composerの導入やLaravelプロジェクトの作成、またデータベースのインストールから接続などが不要になり、それらを意識することなく開発準備を整えることができます。

### Laravel Sail

前述の環境構築を行うためには、**Laravel Sail**と呼ばれるものを使用します。これは公式サイトで、[Laravelのインストール方法として紹介されている](https://laravel.com/docs/8.x/installation#your-first-laravel-project)CLIを利用した方法です。これはDockerを使った構築方法になっているので、事前にDockerが利用できる環境が必要です。macOSであれば、Homebrewを利用したインストールが簡単です。

```bash
brew install --cask Docker # インストール
open /Applications/Docker.app # 起動
```

下記に以前の方法の一例とLaravel Sail を利用した場合の比較を行っていますが、かなり簡潔になっていることがわかります。

従来の方法の例 (example-appは任意のプロジェクト名)

```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
composer global require laravel/installer
export PATH="$HOME/.config/composer/vendor/bin:$PATH"
laravel new example-app # バージョン指定する場合は下記のようになる
# composer create-project laravel/laravel example-app --prefer-dist "5.5.*"

... # 次にデータベースの設定なども行う
```

Laravel Sail を利用する方法 (example-appは任意のプロジェクト名)

```bash
curl -s https://laravel.build/example-app | bash
cd example-app && ./vendor/bin/sail up
```

以上のように、より少ないコマンドで環境構築できる上、データベースの作成や接続なども完了し、またRedisやMailHogも同時に起動しています。
プロジェクトルートに`docker-compose.yml`が配置されており、これらの設定を確認できます。

#### 同時起動サービス

Laravel Sail を利用して環境構築する場合、執筆時点のデフォルト設定では、MySQL, Redis, MeiliSearch, MailHog, Selenium のサービスが起動するようになっていますが、PostgreSQLを利用したい場合やRedisが不要といった場合は、それをインストール時に指定することができます。
その場合はコマンドを以下のように変更し、`mysql`, `pgsql`, `redis`, `memcached`, `meilisearch`, `selenium`,  `mailhog`の中からサービスを指定します。

```bash
curl -s "https://laravel.build/example-app?with=mysql,redis" | bash
```

このように、Laravel Sailを利用することによって、簡単にDocker環境でLaravelを利用した開発を始めることができるようになりました。
> 参考： [Choosing Your Sail Services - Laravel](https://laravel.com/docs/8.x/installation#choosing-your-sail-services)

#### `sail`コマンド

上で使用している`./vendor/bin/sail`は、Laravel Sail によって利用することができるようになったコマンドで、`docker-compose`コマンドと同様の利用法が可能ですが、さらに`./vendor/bin/sail mysql`や`./vendor/bin/sail bash`など、短縮コマンドも用意されており幅広い使い方が可能です。頻繁に利用するので入力の手間を省くため[公式と同じように](https://laravel.com/docs/8.x/sail#configuring-a-bash-alias)エイリアスを設定しておきます。

```bash
alias sail='bash vendor/bin/sail' # ~/.bashrc などに追記する
```

### 初期設定

#### デバッガー

デバッガーは、アプリケーションの状態の把握の目的や、エラーが発生したときに速やかに原因を特定するために導入が必須と言えます。もし"View"をLaravel側で用意する場合には以下のパッケージも有用です。インストールするだけでセッションやリクエスト情報等をブラウザ上で確認することができます。

```bash
sail composer require barryvdh/laravel-debugbar --dev
```

しかし、SPAとして実装を進める場合、ブラウザで立ち上げているのはLaravelではなく、主にフロントエンドのアプリケーションとなるので、用途に合致しないようです。そこで、Laravel公式サイトでパッケージとして紹介されている[Telescope](https://laravel.com/docs/8.x/telescope)を利用します。

#### Telescope

Telescopeを利用することで、リクエストのあらゆる情報が記録されていき、即座にまたは後に確認することができます。取得される情報は、ヘッダーやセッション、その他クエリやキャッシュまで、非常に広範囲にわたります。

> 参考： [Laravel Telescope - Laravel](https://laravel.com/docs/8.x/telescope#introduction)
>> Telescope provides insight into the requests coming into your application, exceptions, log entries, database queries, queued jobs, mail, notifications, cache operations, scheduled tasks, variable dumps, and more.

##### インストール (Telescope)

以下のコマンドによってインストールを行います。

```bash
sail composer require laravel/telescope --dev # 開発環境でのインストール
sail artisan telescope:install # CSSなどアセットファイルの出力
sail artisan migrate # 記録データ格納用テーブルの作成
```

ルートを確認すると、Telescopeで利用されるものが追加されています。[http://localhost/telescope](http://localhost/telescope)にアクセスすることでダッシュボードを確認することができます。

#### タイムゾーン, ロケール

日本語や日本時間を利用する指定を行います。設定ファイルは`app/config/app.php`です。
> 参考： [Initial Configuration - Laravel](https://laravel.com/docs/8.x/installation#initial-configuration)

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

### リソース生成

Laravelでは、アプリケーションに一般的に必要なファイルがコマンド一つで一気に生成可能です。

```bash
sail artisan make:model TaskCard --all --api
```

上記コマンドの`--all`オプションによって、`model`と同時に、 `migration`, `seeder`, `factory`, `controller`のファイルが生成されます。また`--api`オプションの指定をすることで、`controller`に、`index`や`store`などの、APIに必要なアクションが追加された状態となります。
なお、他に利用可能なオプションは`--help`を指定することで確認できます。

```bash
php artisan make:model --help
```

#### 外部キー制約 (Migration)

生成されたファイルの内、まずはマイグレーションファイル (database/migrations/{時刻}_create_task_cards_table.php) を以下のように書き換えます。

```php :database/migrations/{時刻}_create_task_cards_table.php
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

まず`users`テーブルとの外部キー制約の設定を行います。上記のような記述によって、参照整合性を保つことが可能です。すなわち、`user_id`が参照している`users`テーブルの`id`が変更された場合には当該テーブルの`user_id`の値も連動し、`users`テーブルの`id`が削除された場合には参照元である`task_cards`のレコードも同時に削除されされることになります。

> 参考： [Foreign Key Constraints - Laravel](https://laravel.com/docs/8.x/migrations#foreign-key-constraints)

次に、`title`や`content`など、型を指定して、作成するタスクに必要なカラムの設定を行っています。このとき要件によって、null許容やデフォルト値も設定します。

> 参考：
> [Available Column Types - Laravel](https://laravel.com/docs/8.x/migrations#available-column-types)
> [Column Modifiers - Laravel](https://laravel.com/docs/8.x/migrations#column-modifiers)

#### リレーション (Model)

次にモデルに変更を加えます。
始めに`$fillable`プロパティに、アプリ上で変更できるカラムを指定します。これはユーザーの通常の操作によって変更可能かを決定するもので、一般的に`id`や`created_at`(timestamps) などは含めません。

次にリレーションを設定します。今回の場合、一人の`User`が`TaskCard`を複数持つことができる、一対多の関係です。それには`user`プロパティを作成し、`belongsTo`メソッドを追加することで実現します。

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

#### テストデータ (Seeder, Factory)

動作確認用にテスト用のデータがあると便利でしょう。Laravelでは簡単にそのようなデータを作成することができる機能を内包しています。まず、`database/factories/TaskCardFactory.php`の`definition`メソッドに、どのようなデータを生成するかを定義します。

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
なお、上述の[初期設定、タイムゾーン, ロケール](#タイムゾーン-ロケール)で設定したように、`faker`で作成されるデータは日本語になるように指定してありますが、それがライブラリ側に用意されていない場合は日本語になりません。

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

データベースを確認するとデータは作成できていますが、以上のような方法だとテーブルが増えてきたときには面倒になります。よってこれを統合するため、`database/seeders/DatabaseSeeder.php`の内容を以下のように編集します。

```php :database/seeders/DatabaseSeeder.php
public function run()
{
    $this->call(TaskCardSeeder::class);
}
```

このように記述することで、Seederを指定することなくデータ生成が可能です。

```bash
sail artisan db:seed
```

このように、リレーションのあるデータでも簡潔なコードで即座に大量のデータを生成可能であることが確認できました。

> 参考：
> [Defining Model Factories - Laravel](https://laravel.com/docs/8.x/database-testing#defining-model-factories)
> [Database: Seeding - Laravel](https://laravel.com/docs/8.x/seeding)

### CRUD

さて、事前に必要な準備も整ったところで、APIとしてデータベースのデータに対する各機能、`Create`, `Read`, `Update`, `Delete` を実装していきます。

#### Read

まずは、データベースからデータを読み取ることから始めていきます。コードを記述するにあたって比較的制約が少なく簡潔に済みページにアクセスするだけで動作確認できるため、初めに実施しやすい機能です。

データの読み取りはさらに"一覧"と"詳細"に分解でき、Laravelでは、それぞれ`index`アクションと`show`アクションに分類されます。ここで、"詳細"はデータベースでの個別のレコードを表し、"一覧"はそれ以外 (複数のレコード) を表します。

##### index

`index`アクションでは必ずしも全てのデータを読み取るわけではありませんが、動作確認のため、まずは`task_cards`テーブルに存在するデータの全件取得を試みます。

###### ルーティング

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

`group`メソッドを利用することで共通する処理をまとめることができ、第一引数には共有する機能、第二引数にはルート定義を指定しています。

`namespace`には`Controller`ファイルが設置されている場所を指定します。これによって、`Controller`を記述するときに毎回先頭に付与する必要がなくなります。

ちなみにこれは Laravel 8.x での変更点の一つで、以前はアプリケーション側で用意されていました。その従来の方法で`namespace`を指定することも可能です。

> 参考： [Routing Namespace Updates - Laravel](https://laravel.com/docs/8.x/releases#routing-namespace-updates)

`prefix`には`v1`としていますが、これはバージョンを表しておりAPI開発の際の一般的な表記です。

次にルート定義で、`apiResource`メソッドを利用し、第一引数にはテーブル名を、第二引数にはコントローラーを指定します。これだけでAPIにおけるCRUD機能に必要なURIやアクションの割り当てが完了です。リレーションを表すために階層のあるルートを作成したいときは上記のようにドットで繋ぎます。すると以下のようなルートとなります。

| HTTPメソッド | URI (`{user}`は`User`の`id`)| アクション
| -- | -- | -- |
| GET | /api/v1/users/{user}/task_cards | index
| GET | /api/v1/users/{user}/task_cards/create | create
| POST | /api/v1/users/{user}/task_cards | store
| GET | /api/v1/users/{user}/task_cards/{post} | show
| GET | /api/v1/users/{user}/task_cards/{post}/edit | edit
| PUT/PATCH | /api/v1/users/{user}/task_cards/{post} | update
| DELETE | /api/v1/users/{user}/task_cards/{post} | destroy

今の段階では`index`アクションのみ扱うので、`only`メソッドを使用してその他のルートの出力を停止しています。
なお、ルート設定は`artisan`コマンドの`route:list`で確認可能です。

結局、ルート定義としては、`api/v1/users/{user}/task_cards`にGETメソッドでアクセスしたとき`TaskCardController`の`index`アクションを実行するというものになりました。

> 参考： [Resource Controllers - Laravel](https://laravel.com/docs/8.x/controllers#api-resource-routes)

`routes`ディレクトリには、`web.php`もありこちらにルーティングを設定することもできますが、今回はAPIとして利用するため、`api.php`の方に記述します。

両者の違いは主に二つあり、１つはデフォルトのパスの違いです。`api.php`でルーティングを行うとパスの先頭に`api`が付与され、例えば`localhost/api/users`のようになります。
２つ目に、適用されるミドルウェアが異なります。

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

###### ミドルウェア

ここでミドルウェアとは、HTTPリクエストを検査しフィルタリングなど何らかの操作を行う役割を果たすものを指します。
上のファイルの中で、`middleware`メソッドによって適用するミドルウェアを決定しています。引数となっている`api`および`web`はミドルウェアグループと呼ばれるもので、複数のミドルウェアをグループ化して一括で設定するものです。それぞれどのようなミドルウェアが属しているのかについては`app/Http/Kernel.php`に記述があります。

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

###### コントローラー

タスクの一覧を表示させるため、先のルーティング設定で確認したように、`TaskCardController`の`index`アクションを実装していきます。APIとして利用する場合は、"View"の代わりにJSONデータを返却することに注意して以下のように記述します。

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

> 参考： [Dependency Injection & Controllers - Laravel](https://laravel.com/docs/8.x/controllers#dependency-injection-and-controllers)

次に利用している`taskCards`メソッドは、先述の[リレーション (Model)](#リレーション-model)の項目で設定したものです。
そしてデータをJSONとして返却する点ですが、Laravelでは、コントローラーから返却する際には自動的にJSONに変換するため特別の操作は不要です。

> 参考： [Serializing To JSON - Laravel](https://laravel.com/docs/8.x/eloquent-serialization#serializing-to-json)
>> Laravel will automatically serialize your Eloquent models and collections to JSON when they are returned from routes or controllers:

[テストデータ (Seeder, Factory)](#テストデータ-seeder-factory)の項目でデータを生成していれば、[localhost/api/v1/users/1/task_cards](http://localhost/api/v1/users/1/task_cards)にアクセスすることで、`id`が`1`である`User`が持つ`TaskCard`のデータがJSON出力されていることが確認できるはずです。

###### モデル

データをブラウザに返却する際、必ずしも全てのカラムが必要とはいえません。`password`など秘匿した方が好ましいものもあるでしょう。そのような場合はモデルの`$hidden`プロパティにカラムを追加します。

```php :app/Models/TaskCard.php
protected $hidden = [
    'user_id',
];
```

また、データ返却時に値の表示方法を変更したい場合もあります。例えば、`Boolean`型のカラムは値が`0`と`1`で表されます。これをそれぞれ、`false`と`true`にするには`$cast`プロパティにカラムとそのキャストタイプを指定します。

```php :app/Models/TaskCard.php
protected $casts = [
    'done' => 'boolean'
];
```

> 参考： [Attribute Casting](https://laravel.com/docs/8.x/eloquent-mutators#attribute-casting) / Eloquent: Mutators & Casting - Laravel

###### ページネーション

取得するデータが非常に多い場合を想定すると、データベースに負荷がかかり読み込みまで時間がかかることが予想されます。そのような場合、ページネーション機能を用いて、一定のデータ数に分割して取得することが可能です。
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

###### テスト (PHPUnit)

これまでの実装をテストによって確認してみます。現段階ではブラウザでリクエストを送って期待通りのレスポンスが返ってくることは確認済みですが、他の機能を実装する過程でこれが崩れてしまうこともあります。そのとき毎回手動で確認するには多くの時間がかかることでしょう。
よって、テストコードを用意することで、その問題を解決します。

Laravelにおいては、初めから、テストに必要なライブラリである**PHPUnit**および設定ファイルの`phpunit.xml`、また`tests`ディレクトリに初期ファイルが用意されており、すぐにテストを開始することができます。
そこで今、`sail artisan test`を実行すると、`tests`ディレクトリ以下の`Unit`および`Feature`ディレクトリに置かれている`Test.php`で終わるファイルのテストが走ります。

このファイル名などのルールは、`phpunit.xml`に規定されているものです。同様に、テストの実行環境が`testing`になることも定められています。すなわち、`.env.testing`ファイルを用意することで普段と異なる環境で利用できるということです。

ただし注意点として、ファイルが存在しない場合は`.env`の値が用いられるということです。この場合データベースも同じものを使用しているので、これまでに作成したデータが削除されたり想定外のテスト結果となってしまったりすることがあります。

> 参考：[Environment](https://laravel.com/docs/8.x/testing#environment) / Testing: Getting Started - Laravel

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

まず、データが存在しない状態で開始させるため、`use RefreshDatabase`によってデータベースをリフレッシュする処理を先頭に置いています。

次に、`setUp`メソッドでテストに実行したい処理を追加します。ここでは複数のテストで共通で使用するデータの生成などを行います。

そして、テスト処理ではまず`get`メソッドで該当ページへリクエストを送ります。次にそのレスポンスが`data`キーを持っていてそのバリュー数が`20`であることをテストします。

テストの実行には、`sail artisan test`を使用し、成功すれば`PASS`と出力されます。

> 参考： [Scoping JSON Collection Assertions](https://laravel.com/docs/8.x/http-tests#scoping-json-collection-assertions) / HTTP Tests - Laravel

さらにテストを活用するために、後に"[Github Actions](#github-actions)"を利用してCIを導入します。
