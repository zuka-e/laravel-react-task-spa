<?php

use App\Models\User;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\Log;

/*
|--------------------------------------------------------------------------
| Register The Auto Loader
|--------------------------------------------------------------------------
| @see https://bref.sh/docs/runtimes/function.html
| @ref public/index.php
*/

require __DIR__ . '/../vendor/autoload.php';

/*
|--------------------------------------------------------------------------
| Create The Application
|--------------------------------------------------------------------------
| To use the Eloquent model, you should call `bootstarp` first.
| @ref tests/CreatesApplication.php
*/

$app = require __DIR__ . '/../bootstrap/app.php';

$app->make(Kernel::class)->bootstrap();

/*
|--------------------------------------------------------------------------
| Functions on AWS Lambda
|--------------------------------------------------------------------------
| @see https://bref.sh/docs/runtimes/function.html
*/

/** 登録から24時間経過した未認証ユーザーを削除 */
return function () {
  $now = new DateTimeImmutable();
  $yesterday = $now->sub(new DateInterval('PT24H'));
  $unverifiedUsers = User::where('email_verified_at', null);
  $targetUsers = $unverifiedUsers->where('created_at', '<', $yesterday);
  $deletedUsers = $targetUsers->pluck('email', 'id');

  if ($targetUsers->delete()) {
    Log::notice(
      __FILE__ . ': The following users have been deleted => ' . $deletedUsers
    );
    return;
  };

  Log::debug(__FILE__ . ': There were no deleted users');
};
