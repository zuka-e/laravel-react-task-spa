<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTaskListIdColumnsToTaskCardsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('task_cards', function (Blueprint $table) {
            $table->uuid('task_list_id');

            $table->foreign('task_list_id')
                ->references('id')
                ->on('task_lists')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('task_cards', function (Blueprint $table) {
            $table->dropColumn('task_list_id');
        });
    }
}
