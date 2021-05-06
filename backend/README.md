# Backend

## Laravel 8

**Laravel 8.x**では環境構築がこれまでよりさらに容易になっています。以前は必要とされた手順であるComposerの導入やLaravelプロジェクトの作成、またデータベースのインストールや接続設定などが不要になり、それらを意識することなく開発準備を整えることができます。  

### Laravel Sail

前述の環境構築を行うためには、**Laravel Sail**と呼ばれるものを使用します。これは[公式サイトで紹介されている](https://laravel.com/docs/8.x/installation#your-first-laravel-project)パッケージの一つです。要件として、Dockerを使った構築方法になっているので、事前にDockerが利用できる環境が必要です。macOSであれば、Homebrewを利用したインストールが簡単です。  

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

以上のように、より少ないコマンドで環境構築できる上、データベースの作成や接続なども完了し、またRedisやMailHogも同時に起動しています。  
プロジェクトルートに`docker-compose.yml`が配置されており、これらの設定を確認できます。  

#### 同時起動サービス

Laravel Sail を利用して環境構築する場合、執筆時点のデフォルト設定では、MySQL, Redis, MeiliSearch, MailHog, Selenium のサービスが起動するようになっていますが、PostgreSQLを利用したい場合やRedisが不要といった場合は、それをインストール時に指定することができます。  
その場合はコマンドを以下のように変更し、`mysql`, `pgsql`, `redis`, `memcached`, `meilisearch`, `selenium`,  `mailhog`の中からサービスを指定します。  

```bash
curl -s "https://laravel.build/example-app?with=mysql,redis" | bash
```

このように、Laravel Sailを利用することによって、簡単にDocker環境でLaravelを利用した開発を始めることができるようになりました。  

> 参考： [Choosing Your Sail Services](https://laravel.com/docs/8.x/installation#choosing-your-sail-services) / Installation - Laravel  

#### `sail`コマンド

上で使用している`./vendor/bin/sail`は、Laravel Sail によって利用することができるようになったコマンドで、`docker-compose`コマンドと同様の利用法が可能ですが、さらに`./vendor/bin/sail mysql`や`./vendor/bin/sail bash`など、短縮コマンドも用意されており幅広い使い方が可能です。頻繁に利用するので入力の手間を省くため[公式と同じように](https://laravel.com/docs/8.x/sail#configuring-a-bash-alias)エイリアスを設定しておきます。  

```bash
alias sail='bash vendor/bin/sail' # ~/.bashrc などに追記する
```

### 初期設定

アプリケーションの状態を把握し円滑な開発を進めるために、初めに設定の操作やツールの導入を行います。  

#### デバッガー

デバッガーは、アプリケーションの状態の把握の目的や、エラーが発生したときに速やかに原因を特定するために導入が必須と言えます。もし"View"をLaravel側で用意する場合には以下のパッケージも有用です。インストールするだけでセッションやリクエスト情報等をブラウザ上で確認することができます。  

```bash
sail composer require barryvdh/laravel-debugbar --dev
```

しかし、SPAとして実装を進める場合、ブラウザで立ち上げているのはLaravelではなく、主にフロントエンドのアプリケーションとなるので、用途に合致しないようです。そこで、Laravel公式サイトでパッケージとして紹介されている[Telescope](https://laravel.com/docs/8.x/telescope)を利用します。  

#### Telescope

Telescopeを利用することで、リクエストのあらゆる情報が記録されていき、即座にまたは後に確認することができます。取得される情報は、ヘッダーやセッション、その他クエリやキャッシュまで、非常に広範囲にわたります。  

> 参考： [Introduction](https://laravel.com/docs/8.x/telescope#introduction) / Laravel Telescope - Laravel  
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

> 参考： [Initial Configuration](https://laravel.com/docs/8.x/installation#initial-configuration) / Installation - Laravel  

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

生成されたファイルの内、まずはマイグレーションファイル`database/migrations/{時刻}_create_task_cards_table.php`を以下のように書き換えます。  

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

まず`users`テーブルとの外部キー制約の設定を行います。上記のような記述によって、参照整合性を保つことが可能です。すなわち、`user_id`が参照している`users`テーブルの`id`が変更された場合には当該テーブルの`user_id`の値も連動し、`users`テーブルの`id`が削除された場合には参照元である`task_cards`のレコードも同時に削除されされることになります。  

> 参考： [Foreign Key Constraints](https://laravel.com/docs/8.x/migrations#foreign-key-constraints) / Database: Migrations - Laravel  

次に、`title`や`content`など、型を指定して、作成するタスクに必要なカラムの設定を行っています。このとき要件によって、null許容やデフォルト値も設定します。  

> 参考：  
> [Available Column Types](https://laravel.com/docs/8.x/migrations#available-column-types) / Database: Migrations - Laravel  
> [Column Modifiers - Laravel](https://laravel.com/docs/8.x/migrations#column-modifiers) / Database: Migrations - Laravel  

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
> [Defining Model Factories](https://laravel.com/docs/8.x/database-testing#defining-model-factories) / Database Testing - Laravel  
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

> 参考： [Routing Namespace Updates](https://laravel.com/docs/8.x/releases#routing-namespace-updates) / Release Notes - Laravel  

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

> 参考： [Resource Controllers](https://laravel.com/docs/8.x/controllers#api-resource-routes) / Controllers - Laravel  

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

> 参考： [Dependency Injection & Controllers](https://laravel.com/docs/8.x/controllers#dependency-injection-and-controllers) / Controllers - Laravel  

次に利用している`taskCards`メソッドは、先述の[リレーション (Model)](#リレーション-model)の項目で設定したものです。  
そしてデータをJSONとして返却する点ですが、Laravelでは、コントローラーから返却する際には自動的にJSONに変換するため特別の操作は不要です。  

> 参考： [Serializing To JSON](https://laravel.com/docs/8.x/eloquent-serialization#serializing-to-json) / Eloquent: Serialization - Laravel  
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

さらにテストを活用するために、後に"[GitHub Actions](#github-actions)"を利用してCIを導入します。  

### 認証 (Authentication)

Laravelで認証機能を実装する場合、選択肢が複数存在します。  
特に、[Breeze](https://laravel.com/docs/8.x/starter-kits#laravel-breeze)または[Jetstream](https://jetstream.laravel.com/2.x/introduction.html)のパッケージを用いることで、MVCの"View"にあたるUIも内包された状態で認証機能を導入することができます。  
ただ今回はこれを利用せず、**Fortify**と**Sanctum**という二つのパッケージを組み合わせて認証を実装します。  

前述のパッケージを利用しない理由の一つは、"View"の部分で対応しているのが基本的にVue.jsのみであるということです。学習済みである"React"を使用してさらに理解を深めることが目的でもあるので今回は採用を見送ることにしました。Fortifyを利用する場合、UIは提供されていないので自由にフロントエンドを選ぶことが可能です。  

#### Fortify

Fortifyとは、ログインやユーザー登録、メール認証など基本的な認証機能を提供するパッケージです。BreezeおよびJetstreamにおける認証部分を担うものでもあります。  

##### 導入目的 (Fortify)

Fortifyを導入することで、例えば、`login`などのルートと対応するログイン処理が利用できるようになります。  
逆にFortifyを利用しない場合、認証に関するルーティングやコントローラーでの処理など全て作成する必要があります。  
しかしそれは手間がかかる上、知識の不足や実装の過不足によって脆弱性の存在を作り出してしまう原因にもなりえます。さらに認証で実装する内容はアプリケーションによってそれほど違いはないことが多いため、パッケージに任せるのが無難です。  

##### インストール (Fortify)

初めに`sail`コマンドでComposerパッケージからインストールが必要です。  

```bash
sail composer require laravel/fortify
```

次に、アクションやコンフィグ、マイグレーションを出力します。  

```bash
php artisan vendor:publish --provider="Laravel\Fortify\FortifyServiceProvider"
```

マイグレーションファイルの内容をデータベースに反映させます。  

```bash
sail artisan migrate
```

最後に、`Fortify Service Provider`クラスを`config/app.php`に登録することで、アクションを有効化します。  

```php :config/app.php
App\Providers\FortifyServiceProvider::class,
```

##### 設定 (Fortify)

まず、SPAの場合はログイン画面やユーザー登録画面のViewをバックエンドで提供する必要はないので。それらのルートを無効化させるために、設定ファイル`config/fortify.php`で`views`の値を`false`に切り替えます。  

```php :config/fortify.php
'views' => false,
```

次に、ルート名の先頭にこれまで同様の`api`を付与するため、`prefix`を指定します。これにより、例えば、`api/login`のようなルートが提供されるようになります。  

```php :config/fortify.php
'prefix' => 'api',
```

既に`config/fortify.php`の`features`で指定した機能が利用できるようになっており、例えば`api/login`へのPOSTリクエストを、データベースに登録されたユーザー情報を利用して行うことでログイン処理が行われます。  

しかし、別オリジンであるフロントエンドからのリクエストの場合は拒否されます。これを回避するために、後述の [CORS](#cors)および[CSRFトークン](#csrfトークン)の設定、加えて[Sanctum](#sanctum)の導入が必要となります。  

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

#### Sanctum

Sanctumはアプリケーションに認証機能を提供するパッケージです。Fortifyと異なりこちらはルートやコントローラーでの処理は含まれていません。リクエストの正当性を検証するための方法を提供します。  

> [Laravel Fortify & Laravel Sanctum](https://laravel.com/docs/8.x/fortify#laravel-fortify-and-laravel-sanctum) / Laravel Fortify - Laravel  
>> Laravel Sanctum is only concerned with managing API tokens and authenticating existing users using session cookies or tokens. Sanctum does not provide any routes that handle user registration, password reset, etc  

先述のとおり、Fortifyを利用しない場合であっても代わりのコードを用意することは可能です。一方、Sanctumが提供する機能は、`Jetstream`などのパッケージを採用する場合を除いて、API認証を行う上で必要となります。  

##### 認証方式

認証の方法として、APIトークンを利用した認証とSPA認証という二つが用意されていますが、SPAのバックエンドとして用いる場合にはSPA認証の方を利用するべきとの記載があるのでそれに従います。  
SPA認証は、APIトークンの代わりにCookieとセッションを利用した認証方式です。  

> [API Token Authentication](https://laravel.com/docs/8.x/sanctum#api-token-authentication) / Laravel Sanctum - Laravel  
>> You should not use API tokens to authenticate your own first-party SPA. Instead, use Sanctum's built-in SPA authentication features.  

##### インストール (Sanctum)

初めに`sail`コマンドでComposerパッケージからインストールが必要です。  

```bash
sail composer require laravel/sanctum
```

次に、コンフィグおよびマイグレーションを出力します。  

```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

最後に、マイグレーションファイルの内容をデータベースに反映させます。  

```bash
sail artisan migrate
```

##### 設定 (Sanctum)

まずフロントエンドでCookieを受け入れるようにするため、使用しているドメインを`config/sanctum.php`に追加します。利用している環境によって異なりますが、今回の場合、`localhost:3000`です。なお実際に編集するのは下の`.env`ファイルです。  

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

```php : app/Http/Kernel.php
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

先述のように、Sanctumは、Cookieとセッションを利用した認証方式です。しかしデフォルトではミドルウェアグループ`api`に含まれていません。`EnsureFrontendRequestsAreStateful`はそれらの他必要なミドルウェアの代替も果たすものです。  
そして、上記の`SANCTUM_STATEFUL_DOMAINS`からのリクエストの場合にそれを有効にさせるようになっています。  

##### 認証付きルート

アクセスにログインを必要とするルートを定義するには、`sanctum`"guard"を追加します。  

```php :
Route::middleware('auth:sanctum')
    ->apiResource('users.task_cards', TaskCardController::class)
    ->only('store');
```

未ログインの状態でアクセスした場合には`401`エラーが発生します。  

##### ログイン

ログインを行うには設定済みのFortifyによって提供されるルート`api/login`にユーザー情報を持ったPOSTリクエストを送ります。[後述のCORSの設定](#cors)は完了済みとすると、Axiosでは例えば以下のようになります。  

```typescript
apiClient.post('/api/login', {
    email: 'username@example.com',
    password: 'password'
}).then(response => {
    console.log(response)
})
```

このとき、`email`に'username@example.com'を持ち`password`の値が'password'である`User`が存在しない場合、`422`エラーが発生します。  

注意点として、データベースとの値と照合するときの`password`の値はハッシュ値であるということです。テストを行う際には、データ生成用の`UserFactory`における`password`の値がハッシュ化されていることを確認します。なお、デフォルトでは'password'のハッシュ値になっているようです。  

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

まだCSRF保護機能への対応を行っていないので、このリクエストに対してサーバーは`419 (CSRF token mismatch)`エラーを返します。  

##### CSRFトークン

LaravelではセッションごとにCSRFトークンを生成し、リクエスト時にそれを検証することで正当なユーザーからのアクセスであることを確認します。このCSRFトークンは取得した後Cookie`XSRF-TOKEN`にセットして使用します。  
そのためには、前述のログインリクエストの前に`sanctum/csrf-cookie`に対するGETリクエストを行うことが必要です。  

```typescript
apiClient.get('/sanctum/csrf-cookie').then(response => {
    apiClient.post('/api/login', {
        email: 'username@example.com',
        password: 'password'
    }).then(response => {
        console.log(response)
    })
});
```

なお、`config/cors.php`へ`sanctum/csrf-cookie`の追加が必要です。([CORSの項目参照](#cors))

```php :config/cors.php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
```

そして、リクエスト時にこの`XSRF-TOKEN`の値をヘッダー`X-XSRF-TOKEN`にセットすることが必要です。**Axiosを利用している場合には**この動作を自動的に行います。  

Cookieが有効であり、`XSRF-TOKEN`の値が`X-XSRF-TOKEN`に入っていれば、その後のリクエストで`419`エラーは発生しなくなりこれは成功となります。  

なお、セッションの期限切れなどによって有効でなくなった場合には、`401`および`419`エラーが返されます。その場合再度ログインが必要となるので、フロントエンド側のルーティング処理によってログインページにリダイレクトを行います。  

> 参考：  
> [Authentication - Laravel](https://laravel.com/docs/8.x/authentication)  
> [CSRF Protection - Laravel](https://laravel.com/docs/8.x/csrf)  
> [Laravel Sanctum - Laravel](https://laravel.com/docs/8.x/sanctum)  
> [Using Sanctum to authenticate a React SPA | Laravel News](https://laravel-news.com/using-sanctum-to-authenticate-a-react-spa)  
> [Laravel Sanctum SPA Tutorial - React SPA Authentication With Sanctum - YouTube](https://www.youtube.com/watch?v=uPKd3q-iaVs)  
> [Getting started with Laravel Fortify and Sanctum - YouTube](https://www.youtube.com/watch?v=W7owQcBYerA)  

#### CORS

異なるオリジン間でサーバーからのレスポンスを受け取るには、CORS (Cross-Origin Resource Sharing) の設定が必要になります。  
これはブラウザに備えられた同一オリジンポリシーの機能によって、他のオリジンのリソースにアクセス制限がかけられているためです。  

> 参考：  
> [オリジン間リソース共有 (CORS) - HTTP | MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS)  
> [同一オリジンポリシー - Web セキュリティ | MDN](https://developer.mozilla.org/ja/docs/Web/Security/Same-origin_policy)  
> A digression on CORS / [Using Sanctum to authenticate a React SPA | Laravel News](https://laravel-news.com/using-sanctum-to-authenticate-a-react-spa)  

##### `Access-Control-Allow-Origin`

CORSを有効化するためには、まずレスポンスヘッダー`Access-Control-Allow-Origin`の値にフロントエンドで利用しているオリジン (ここでは`http://localhost:3000`) を指定する必要がありますが、Laravelでは、`config/cors.php`でそれを行います。  
以下のように、許可されるオリジンではワイルドカードが使用されており任意の値を示していますが、一方パスの指定では制限がかけられています。  

```php :config/cors.php
'paths' => ['api/*', 'sanctum/csrf-cookie'], // CORSを許可するパス
// ...
'allowed_origins' => ['*'], // CORSを許可するオリジン
```

ルート設定で`routes/api.php`を利用しているので、リクエストは基本的に許可されるパスに対するものになります。一方、Sanctumを利用する際に`sanctum/csrf-cookie`のルートが必要ですが、これは先頭が`api`でないため上記`paths`の値に追加します。  

このヘッダーと、リクエスト側のヘッダーである`Origin`の値が一致してしる場合、CORSは有効に作用します。なお、この`Origin`はリクエストヘッダーに付与されるので特に設定の必要はありません。  

##### プリフライトリクエスト

CORSを利用するにあたって、ブラウザは本来のリクエストの前にそれが許可されているかをサーバーに問い合わせる目的で`OPTIONS`リクエストを送信します。これをプリフライトリクエストといいます。  

ここで前述の`config/cors.php`がリクエストを許可する設定になっていれば、CORSポリシーによるブロックは解かれるようになります。  

##### `Access-Control-Allow-Credentials`

加えて、Cookieを利用したリクエストの場合は、レスポンスヘッダーに`Access-Control-Allow-Credentials`を`true`にして追加することも必要です。Laravelでそれを行うには、`config/cors.php`の`supports_credentials`を`true`に設定します。  

```php :config/cors.php
'supports_credentials' => true,
```

次に、リクエスト側でも上記に対応する設定が必要で、例えばAxiosを利用する場合、`withCredentials`オプションを`true`にして追加します。なお、以下のようにインスタンスを作成し、リクエスト時にこれを代わりに使用することで、次回以降同じ設定を利用することが可能です。  

```typescript
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost',
    withCredentials: true,
});

// 例： axios.get() の代わりに、apiClient.get() を使用
```

> 参考： [The Axios Instance | Axios Docs](https://axios-http.com/docs/instance/)  

##### Cookie

Cookieに関して、上記に加えてもう一つ設定があります。それはCookieが利用できるドメインを指定することです。これはサーバー側の設定なので、今回の場合`localhost`になります。また、これはCookieのDomain属性を設定することに該当し、Laravelでは、`config/session.php`の`domein`の値を指定することで対応します。  

```php :config/session.php
'domain' => env('SESSION_DOMAIN', null),
```

指定していない場合はCookieを設定したのと同じオリジンになりますが、サブドメインは除外されます。したがって、サブドメインでも利用する場合に当該設定が必要となり、表記法は以下のように先頭にドットを付与したものとなります。  

```bash :.env
SESSION_DOMAIN=.domain.com
```

> 参考： [HTTP Cookie の使用 - HTTP | MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/Cookies)  

### GitHub Actions

**GitHub Actions** とは、事前に規定したイベントが発生した際に、自動的に任意のコマンドを実行することができるサービスです。イベントに指定可能なものとして、リポジトリへのPushやPull Request があり、特定のBranchの場合に限定するといった条件を指定することも可能です。  
また、イベント駆動に限らず、スケジュールに従って実行することもできます。  

> 参考： [ワークフローをトリガーするイベント - GitHub Docs](https://docs.github.com/ja/actions/reference/events-that-trigger-workflows)  

#### 導入目的

GitHub Actions を導入することで、コードのビルドやテストの実行およびデプロイなどを、イベントに従って自動で行うことができます。これによって、コードの変更による他の箇所への影響を早期に発見し対処することが可能となると同時に、このような頻繁に発生する定型業務を効率化しつつ強制することができます。すなわちCI/CDの実現を目指します。  

ここでは、[Laravelにおけるテストの項目](#テスト-phpunit)でテストを作成したのでそれを利用します。今回は、PushおよびPull Request のタイミングで対象Branchは問わずに実行していきます。  

#### 料金

**パブリックリポジトリでは無料**で利用することができます。  

プライベートリポジトリでは、一定のリソース消費までは無料となります。GitHubの料金プランによってその範囲は異なりますが、現在は以下のような制限となっています。  

| 製品 | ストレージ | 利用時間 (分) / 月 |
|---|---|---|
| GitHub Free | 500 MB | 2,000 |

最新の料金体系については変更の可能性があるので、下記の参考サイトを確認する必要があります。  

> 参考： [GitHub Actionsの支払いについて - GitHub Docs](https://docs.github.com/ja/github/setting-up-and-managing-billing-and-payments-on-github/about-billing-for-github-actions)  

#### 実行環境

GitHub Actions では、**GitHubホストランナー**と呼ばれる仮想環境が提供されており、定義したコマンドが実際に実行される場所はこのGitHubホストランナー上となります。よって、それに対応させるようにコマンドの調整が必要になります。しかし、一般的なユースケースはテンプレートとして用意されているので、それに従うことで導入コストを抑えることができます。  
なお、上記の仮想環境ではなく独自で用意したホストを利用する方法もあります。  

> 参考：  
> [GitHubホストランナーについて - GitHub Docs](https://docs.github.com/ja/actions/using-github-hosted-runners/about-github-hosted-runners)  
> [セルフホストランナーについて - GitHub Docs](https://docs.github.com/ja/actions/hosting-your-own-runners/about-self-hosted-runners)  

#### 導入方法

GitHub Actions は導入から動作させるまでに特段の準備は必要ありません。リポジトリのルートに`.github/workflows`ディレクトリを作成し、その配下に設定やコマンドなどの手順 (**ワークフロー**) を記述したYAMLファイル を設置するだけです。このように導入が容易なことも利点の一つと言えます。  

このワークフローの作成においてもテンプレートを利用して簡単に始めることができます。次のGitHubリポジトリ [actions/starter-workflows: Accelerating new GitHub Actions workflows](https://github.com/actions/starter-workflows) に様々な言語でCI/CDに利用できるコードが提供されています。またこちらへのアクセスは、利用しているリポジトリの"Actions"タブからも可能です。  

また、GitHubコミュニティによって作成されたものを利用することもでき、[GitHub Marketplace](https://github.com/marketplace?type=actions) からそれらにアクセスできます。  

##### ワークフローの作成

今回の主な目的としてはテストを行うことです。すなわち**PHPUnit**によるテスト実行コマンドを走らせることができればいいことになります。しかし、GitHubホストランナー上の環境はまだその準備ができていないので、初めにそれを整える必要があります。具体的には、`.env`ファイルの生成やパッケージインストールなどです。  

それも含めてワークフローを作成すると以下のようになります。なおこれは下記参考サイトのLaravelにおけるワークフローを一部改変したものです。  

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

YAML構文の最上位に`jobs`が来ています。これはワークフロー内のジョブ (ここでは`test`一つのみ) をまとめるものです。複数のジョブが存在する場合は並行実行します。  
また、ジョブは一連のステップ`steps`から構成されます。そのステップにおいてはアクション`uses`またはシェルコマンド`run`を指定します。  
アクションには、上記の`actions`の他、[GitHub Marketplace](https://github.com/marketplace?type=actions) で提供されているものを利用することも可能です。  
なお、`actions/checkout`は必須のアクションとなっています。  

> [ワークフローファイルを理解する](https://docs.github.com/ja/actions/learn-github-actions/introduction-to-github-actions#understanding-the-workflow-file) - GitHub Actions 入門 - GitHub Docs  
>> ワークフローがリポジトリのコードに対して実行されるとき、またはリポジトリで定義されたアクションを使用しているときはいつでも、チェックアウトアクションを使用する必要があります。  

次に、依存関係のインストールです。ここでのオプションは主に余計な出力を制限しています。詳細は`sail composer install --help`にて確認可能です。  

そしてアプリケーションキーの生成ですが、ここでのポイントとしては、下記参考サイトでは行っている`.env`ファイル作成処理を行わない代わりに、`php artisan key:generate`実行時に`--env=testing`オプションを指定していることです。これにより、`.env.testing`に`APP_KEY`の値が生成されることになります。またテスト`phpunit`実行時に`.env.testing`が存在すればその値を参照するため`.env`は不要です。  

> 参考：  
> [GitHub Actionsのワークフロー構文 - GitHub Docs](https://docs.github.com/ja/actions/reference/workflow-syntax-for-github-actions)  
> [Laravel workflow](https://github.com/actions/starter-workflows/blob/a3d822534a3d6467de0aba8563d4c7ee25b7a94c/ci/laravel.yml) - actions/starter-workflows/ci/laravel.yml - GitHub  

###### データベースコンテナ

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

このコンテナにアクセスするには上でマッピングしたポート`3306`と`DB_HOST`にローカルホストを指定します。ここで`localhost`ではなく`127.0.0.1`を利用することに注意が必要です。前者では現状、`SQLSTATE[HY000] [2002] No such file or directory`エラーが発生します。  

```yml :test.yml
- name: Execute tests
  env:
    DB_HOST: 127.0.0.1
  run: ./vendor/bin/phpunit
```

このアクセス情報が`.env.testing`ファイルに設定されていればコードは不要ですが、`DB_HOST`の値はローカル環境でテスト用データベースのホスト名`mysql.test`を指定しているので上書きが必要です。  

> 参考：  
> [ランナーマシン上で直接のジョブの実行](https://docs.github.com/ja/actions/guides/creating-postgresql-service-containers#running-jobs-directly-on-the-runner-machine) / PostgreSQLサービスコンテナの作成 - GitHub Docs  
> [Workflow syntax for GitHub Actions - GitHub Docs](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idservices)  

###### キャッシュ

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

なお、`working-directory`に`./backend`を指定していましたが、ここではルートディレクトリからの相対パスまたは絶対パスを設定します。`working-directory`から見た`./vendor`ではないことに注意が必要です。  

> 参考：  
> [依存関係をキャッシュしてワークフローのスピードを上げる - GitHub Docs](https://docs.github.com/ja/actions/guides/caching-dependencies-to-speed-up-workflows)  
> [PHP - Composer](https://github.com/actions/cache/blob/main/examples.md#php---composer) - actions/cache/examples.md - GitHub  
> [Skipping steps based on cache-hit](https://github.com/actions/cache#Skipping-steps-based-on-cache-hit) - actions/cache - GitHub  
> [PHP workflow](https://github.com/actions/starter-workflows/blob/a3d822534a3d6467de0aba8563d4c7ee25b7a94c/ci/php.yml) - actions/starter-workflows/ci/php.yml - GitHub  

###### 完成形

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

このYAMLファイルがリポジトリのルートに設置されている`.github/workflows`ディレクトリに格納することで、以降のPushおよびPull Request のタイミングでテストが実行され、その結果はリポジトリの"Actions"タブから確認することができるようになります。  
