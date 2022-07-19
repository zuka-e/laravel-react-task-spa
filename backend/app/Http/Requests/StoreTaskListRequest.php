<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class StoreTaskListRequest extends FormRequest
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
            'title' => 'required|string|min:1|max:255',
            'description' => 'nullable|string|min:1|max:2000',
        ];
    }
}
