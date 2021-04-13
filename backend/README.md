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


];
```
