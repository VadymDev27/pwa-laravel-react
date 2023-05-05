<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::group(['prefix' => 'auth'], function () {
    Route::post('login', 'AuthController@login');
    Route::post('signup', 'AuthController@signup');
  	Route::get('signup/activate/{token}', 'AuthController@signupActivate');

    Route::group([
      'middleware' => 'auth:api'
    ], function() {
        Route::get('logout', 'AuthController@logout');
        Route::get('user', 'AuthController@user');
        Route::post('postnew', 'PostController@uploadPosts');
        Route::get('timeline', 'PostController@getTimeline');
        Route::get('allusers', 'AuthController@getAllUsers');
    });
});

Route::group(['namespace' => 'Auth','middleware' => 'api','prefix' => 'password'],function () {    
	    Route::post('create', 'PasswordResetController@create');
	    Route::get('find/{token}', 'PasswordResetController@find');
	    Route::post('reset', 'PasswordResetController@reset');
});