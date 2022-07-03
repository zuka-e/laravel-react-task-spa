<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TaskBoardRequest extends FormRequest
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
        if ($request->method() === 'POST') {
            return [
                'title' => 'required|string|max:255',
                'description' => 'nullable|string|max:2000',
            ];
        } else {
            return [
                'title' => 'string|max:255',
                'description' => 'nullable|string|max:2000',
                'list_index_map' => 'nullable|array',
                'card_index_map' => 'nullable|array',
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
