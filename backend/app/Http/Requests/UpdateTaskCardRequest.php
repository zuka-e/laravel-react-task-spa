<?php

namespace App\Http\Requests;

use App\Models\TaskList;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

/**
 * @see https://laravel.com/docs/9.x/validation#form-request-validation
 */
class UpdateTaskCardRequest extends FormRequest
{
    /**
     * Indicates if the validator should stop on the first rule failure.
     *
     * @var bool
     */
    protected $stopOnFirstFailure = true;

    /**
     * Get data to be validated from the request.
     *
     * @return array<string, mixed>
     */
    public function validationData()
    {
        $requests = [];

        foreach ($this->all() as $key => $value) {
            $requests[Str::snake($key)] = $value;
        }

        return $requests;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, string|array>
     */
    public function rules()
    {
        return [
            // https://laravel.com/docs/9.x/validation#rule-exists
            'list_id' => [
                'uuid',
                Rule::exists(TaskList::class, 'id')->where(function (
                    Builder $query,
                ) {
                    return $query->where('user_id', Auth::id());
                }),
            ],
            'title' => 'string|min:1|max:255',
            'content' => 'nullable|string|min:1|max:2000',
            'deadline' => 'date',
            'done' => 'boolean',
        ];
    }
}
