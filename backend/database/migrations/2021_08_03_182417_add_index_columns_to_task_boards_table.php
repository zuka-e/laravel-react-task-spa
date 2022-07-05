<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIndexColumnsToTaskBoardsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('task_boards', function (Blueprint $table) {
            $table
                ->json('list_index_map')
                ->comment('Object with a List ID key and its sequence value')
                ->nullable();
            $table
                ->json('card_index_map')
                ->comment('Object with a Card ID key and its sequence value')
                ->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('task_boards', function (Blueprint $table) {
            $table->dropColumn(['list_index_map', 'card_index_map']);
        });
    }
}
