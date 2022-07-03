<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTaskCardsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('task_cards', function (Blueprint $table) {
            $table->comment('Minimum unit of a task');

            $table->uuid('id')->primary();
            $table
                ->foreignUuid('user_id')
                ->comment('User ID')
                ->constrained()
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->string('title', 255);
            $table->string('content', 2000)->nullable();
            $table->dateTime('deadline')->nullable();
            $table->boolean('done')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('task_cards');
    }
}
