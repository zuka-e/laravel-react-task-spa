<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TaskListRequest extends FormRequest
{
    /**
     * Get data to be validated from the request.
     *
     * @return array
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
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(Request $request)
    {
        $maxTitle = floor(191 / 3);
        $maxDescription = floor(65535 / 3);

        if ($request->method() === 'POST') {
            return [
                'title' => "required|string|max:${maxTitle}",
                'description' => "nullable|string|max:${maxDescription}",
            ];
        } else {
            return [
                'title' => "string|max:${maxTitle}",
                'description' => "nullable|string|max:${maxDescription}",
            ];
        }
    }

    /**
     * Indicates if the validator should stop on the first rule failure.
     *
     * @var bool
     */
    protected $stopOnFirstFailure = true;
}
