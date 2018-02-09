<?php

namespace Kostant\LaravelAjaxHandler\Exeptions;


use Exception;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Session\TokenMismatchException;
use Kostant\LaravelAjaxHandler\RespondsJson;

class Handler extends \App\Exceptions\Handler
{
    use RespondsJson;

    public function render($request, Exception $exception)
    {
        if ($exception instanceof TokenMismatchException && $request->expectsJson()) {

            return $this->jsonError('Opps! Seems you couldn\'t submit form for a long time. Please refresh the page and try again.', [], 403);
        }

        if ($exception instanceof AuthenticationException && $request->expectsJson()) {
            session()->flash('Session expired.', 'warning');

            return $this->jsonError($exception->getMessage(), [
                'redirectUrl' => route('login'),
            ], 401);
        }
    }
}