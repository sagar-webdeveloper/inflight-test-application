import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";
import { Post } from "./post.model";

const BACKEND_URL = environment.apiUrl + "/posts/";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                id: post._id,
                status: post.status,
                flightCode: post.flightCode,
                flightProvider: post.flightProvider,
                source: post.source,
                sourceCode: post.sourceCode,
                destination: post.destination,
                destinationCode: post.destinationCode,
                arrivalDate: post.arrivalDate,
                departureDate: post.departureDate,
                arrivalTime:post.arrivalTime
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      status: string;
      flightCode: string;
      flightProvider: string;
      source:string;
      sourceCode:string;
      destination:string;
      destinationCode:string;
      arrivalDate:string;
      departureDate:string;
      arrivalTime:string
    }>(BACKEND_URL + id);
  }

  addPost(status: string, flightCode: string, flightProvider: string,
    source:string,sourceCode:string, destination:string, destinationCode:string, arrivalDate:string, departureDate:string, arrivalTime:string) {
    const postData = new FormData();
    postData.append("status", status);
    postData.append("flightCode", flightCode);
    postData.append("flightProvider", flightProvider);
    postData.append("source", source);
    postData.append("sourceCode",sourceCode);
    postData.append("destination",destination);
    postData.append("destinationCode",destinationCode);
    postData.append("arrivalDate", arrivalDate);
    postData.append("departureDate",departureDate);
    postData.append("arrivalTime",arrivalTime); 
    this.http
      .post<{ message: string; post: Post }>(
        BACKEND_URL,
        postData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, status: string, flightCode: string, flightProvider: string,
     source:string,sourceCode:string, destination:string, destinationCode:string, arrivalDate:string, departureDate:string, arrivalTime:string) {
    let postData: Post | FormData;
      postData = {
        id: id,
        status: status,
        flightCode: flightCode,
        flightProvider: flightProvider,
        source: source,
        sourceCode: sourceCode,
        destination:destination,
        destinationCode:destinationCode,
        arrivalDate:arrivalDate,
        departureDate:departureDate,
        arrivalTime:arrivalTime
      };
    
    this.http
      .put(BACKEND_URL + id, postData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  addcomments(id: string, comment:string, likes:any) {
    let commentData={
      id:id,
      comment:comment,
      likes:likes
    }
   return this.http.post(BACKEND_URL + environment.addComment + id,commentData)
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId).subscribe(response => {
      this.router.navigate(["/"]);
    });
  }
}
