<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\User;
use App\Notifications\SignupActivate;
use Illuminate\Support\Str;
use Laravolt\Avatar\Facade as Avatar;
use Storage;
use App\Posts;
use Image;
use Validator,Redirect,Response,File;
class PostController extends Controller
{
  
    /**
     * Upload a post for user
     *
     * @return [json] user object
     */
    public function uploadPosts(Request $request)
    {
        $this->validate($request, [
            'file' => 'required',
            'caption' => 'required|string|min:20|max:255',
            'hashtags' => 'required|string',
        ]);
        if($request->get('file'))
       {
          $image = $request->get('file');
          $name = time().'.' . explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
          \Image::make($request->get('file'))->save(public_path('images/').$name);
        }

        $user = $request->user();
        $post = new Posts();
        $post->user_id = $user['id'];
        $post->username = $user['username'];
        $post->caption = $request['caption'];
        $post->hashtags =  json_encode(explode (",", $request['hashtags']));
        $post->filename= $name;
        $post->save();
        return response()->json([
            'success' => true,
            'id' => $user->id,
            'name' => $user->first_name,
            'email' => $user->email,
        ], 201);
    }

     /**
     * Get updated Timeline data
     *
     * @return [json] timeline object
     */
    public function getTimeline(Request $request){
        $itemsPaginated =  Posts::orderBy('updated_at','desc')->paginate(2);
        $itemsTransformed = $itemsPaginated
            ->getCollection()
            ->map(function($item) {
                return [
                    'id' => $item->id,
                    'username' => '@'.$item->username,
                    'caption' => $item->caption,
                    'hashtags' => $this->getHashtags($item->hashtags),
                    'modified_at' => $item->modified_at,
                    'created_at' => $item->created_at->format('d-m-Y h:i'),
                    'file' => '/images/'.$item->filename,
                ];
        })->toArray();

        $itemsTransformedAndPaginated = new \Illuminate\Pagination\LengthAwarePaginator(
            $itemsTransformed,
            $itemsPaginated->total(),
            $itemsPaginated->perPage(),
            $itemsPaginated->currentPage(), [
                'path' => \Request::url(),
                'query' => [
                    'page' => $itemsPaginated->currentPage()
                ]
            ]
        );

        return response()->json($itemsTransformedAndPaginated);
    }


    /**
     * Get formatted hashtags for timeline
     *
     * @return [string] hashtags 
     */
    protected function getHashtags($hashtag){
        $hashtag = preg_split ("/\,/", $hashtag); 
        $hashtagsToReturn = null;
        foreach ($hashtag as $key => $value) {
            $hashtagsToReturn .= '#'.preg_replace('/[^A-Za-z0-9]/', '', $value).' ';
        }

        return $hashtagsToReturn;
    }




}
