# Backend

## Laravel 8

Laravel 8 では環境構築がこれまでよりさらに容易になっています。以前は行っていた、Composerの導入やLaravelプロジェクトの作成、またデータベースのインストールから接続などが不要になり、それらを意識することなく開発準備を整えることができます。

### Laravel Sail

前述の環境構築を行うためには、**Laravel Sail**と呼ばれるものを使用します。これは公式サイトで、Laravelのインストール方法として紹介されている軽量のCLIです。これはDockerを使った構築方法になっているので、事前にDockerが利用できる環境が必要です。

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

なお、執筆時点のデフォルト設定では、MySQL, Redis, MeiliSearch, MailHog, Selenium のサービスが起動するようになっていますが、PostgreSQLを利用したい場合やRedisが不要といった場合は、インストール時に指定することができます。
その場合はコマンドを以下のように変更し、`mysql`, `pgsql`, `redis`, `memcached`, `meilisearch`, `selenium`,  `mailhog`の中からサービスを指定します。

```bash
curl -s "https://laravel.build/example-app?with=mysql,redis" | bash
```

このように、Laravel Sailを利用することによって、簡単にDocker環境でLaravelを利用した開発を始めることができるようになりました。

#### `sail`コマンド

上で使用している`./vendor/bin/sail`は、Laravel Sail によって利用することができるようになったコマンドで、`docker-compose`コマンドと同様の利用法が可能ですが、さらに`./vendor/bin/sail mysql`や`./vendor/bin/sail bash`など、短縮コマンドも用意されており幅広い使い方が可能です。頻繁に利用するので入力の手間を省くため[公式と同じように](https://laravel.com/docs/8.x/sail#configuring-a-bash-alias)エイリアスを設定しておきます。

```bash
alias sail='bash vendor/bin/sail' # ~/.bashrc などに追記する
```

### 初期設定

#### デバッガー導入

初期設定とは少し異なりますが初めに導入しておいたほうが良いと思うのがデバッガーです。、インストールするだけでブラウザ上で、セッションやリクエスト情報等を確認することができ、開発時に非常に便利です。
またインストールには前述の`sail`コマンドを利用します。これによってコンテナ内での実行を行うことができます。

```bash
sail composer require barryvdh/laravel-debugbar --dev
```

#### 地域設定

日本語や日本時間を利用する指定を行います。設定ファイルは`app/config/app.php`です。

```php :app/config/app.php
<?php

return [

...

    'timezone' => 'Asia/Tokyo',

    'locale' => 'jp',

    'faker_locale' => 'ja_JP',

...

];
```