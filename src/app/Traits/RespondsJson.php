<?php

namespace Kostant\LaravelAjaxHandler;

use Illuminate\Http\JsonResponse;

trait RespondsJson
{
    /**
     * @param iterable $data
     * @param int $status
     *
     * @return JsonResponse
     */
    public function jsonSuccess(iterable $data = [], int $status = 200): JsonResponse
    {
        return response()->json(collect(['success' => true, 'data' => $data]), $status);
    }

    /**
     * @param iterable $errors
     * @param iterable $data
     * @param int $status
     *
     * @return JsonResponse
     */
    public function jsonError(string $message, iterable $data = [], int $status = 400): JsonResponse
    {
        return response()->json(
            collect(['success' => false, 'message' => $message, 'errors' => $data]),
            $status
        );
    }
}