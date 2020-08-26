// Copyright 2015, 2017 Greenwerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to https://greenwerx.org/docs/license.txt  for full license details.

import {  Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Api } from '../api/api'; // '../api/api.service';
import {Post } from '../../models/post';
import { Filter, Screen, ServiceResult } from '../../models';
import { Observable, of as observableOf} from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class PostService  {

    public Categories: string[] = [];

    public AvailableScreens:  Screen[] = []; // cache this

    Posts: Post[] = [];

    constructor(private api: Api) {
        /*
        this.PostFilter = this.api.initializeFilterLocation(this.PostFilter);
        this.PostFilter.SortBy = 'PublishDate';
        this.PostFilter.SortDirection = 'asc';
        this.PostFilter.PageSize = 50;
        this.PostFilter.StartIndex = 0;
        this.PostFilter.PageResults = true;
        */
       }

    deletePost(postUUID) {
        return this.api.invokeRequest('DELETE', 'api/Posts/' + postUUID);
    }

    getAllPosts(filter: Filter) {  // end point was AllPosts
        return this.api.invokeRequest('POST', 'api/Posts', filter);
    }

    getPost() {
      return this.api.invokeRequest('GET', 'api/Post');
    }

    getPostBy(uuid: string) {
        for (let i = 0; i < this.Posts.length; i++) {
            if (this.Posts[i].UUID === uuid) {
                const res = new ServiceResult();
                res.Code = 200;
                res.Result = this.Posts[i];
                return observableOf( res );
            }
        }
        return this.api.invokeRequest('GET', 'api/PostsBy/' + uuid);
    }

    getCachedPost(uuidOrName: string) {
        console.log('post.service.ts getCachedPost uuidOrName:', uuidOrName);
        for (let i = 0; i < this.Posts.length; i++) {
            let name = this.Posts[i].Name;
            if ( name === undefined) { name = '4asd0f9j43masd9'; }

            if (this.Posts[i].UUID === uuidOrName  ||
                name.toLowerCase() === uuidOrName.toLowerCase()) {
                const res = new ServiceResult();
                res.Code = 200;
                res.Result = this.Posts[i];
                return observableOf( res );
            }
        }
        return this.api.invokeRequest('GET', 'api/PostsBy/' + uuidOrName);
    }

    getPosts() {
        return this.api.invokeRequest('GET', 'api/Posts');
    }

    logOut() {
        this.Categories = [];
        this.AvailableScreens = [];
        this.Posts = [];
    }

    savePost(post: any) {
      return this.api.invokeRequest('POST', 'api/Posts/Add', post);
    }

    searchUserPosts(filter: Filter) {
         return this.api.invokeRequest('POST', 'api/Posts/Search',filter);
    }

    setPostImage(postUUID: string, attributeUUID: string) {
        console.log('post.service.ts NOT IMPLEMENTED');
        // return this.api.invokeRequest('PATCH', 'api/Posts/' + postUUID + '/SetImage/' + attributeUUID );
    }

    stickyPost(uuid: string) {
        console.log('post.service.ts NOT IMPLEMENTED');
        return this.api.invokeRequest('PATCH', 'api/Posts/' + uuid + '/sticky' );
    }

    updatePost(post: any) {
        return this.api.invokeRequest('POST', 'api/Posts/Update', post);
      }

    uploadFormEx( form: FormData, UUID: string, type: string) {
        console.log('post.service.ts NOT IMPLEMENTED');
        // return this.api.uploadForm( 'api/file/upload/' + UUID + '/' + type, form); }
    }
}
