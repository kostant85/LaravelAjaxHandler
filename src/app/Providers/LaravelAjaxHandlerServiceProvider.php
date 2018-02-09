<?php

namespace Kostant\LaravelAjaxHandler\Providers;


use Illuminate\Support\ServiceProvider;
use Kostant\LaravelAjaxHandler\Exeptions\Handler;

class LaravelAjaxHandlerServiceProvider extends ServiceProvider
{
    /**
     *
     */
    public function register()
    {
        $this->app->bind(\App\Exceptions\Handler::class, Handler::class);
    }

    public function boot()
    {
        $this->publishes([
            __DIR__. '/../../' . '/resources/assets/js' => public_path('js'),
        ], 'public');
    }
}