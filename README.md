

  
## alcjs  
  
### Installation  
  
With npm:  
  
 	npm install @team-decorate/alcjs  
 ### Usage  
  
#### Model create  
```js  
import {Model, ArrayMappable} from '@team-decorate/alcjs'  
import Post from './models/Post'  
import Comment from './models/Comment'  
  
/*
* Only those added to fillable will be sent
*/
const FILLABLE = [  
 'id', 'name', 'email', 'password', 'type'
 ]  
  
class User extends Model {  
  constructor(data) {  
	 super()         
	 this.fillable = FILLABLE 
	 //presents is send even if the field is empty 
	 this.presents = ['type']  
	        
	 this.id = 0  
	 this.name = '' 
	 this.email = '' 
	 this.password = '' 
	 this.type = 0 
	 this.posts = [] 
	 this.userComments = [] 
	 
	 this.arrayMap(  
		 new ArrayMappable(Post), 
		 new ArrayMappable(Comment).bind('userComments')
	) 
	
	this.data = data  
 }
}  
```  
  
#### How to use
```json
	#user api json response
	{
	  "id": 1,
	  "name": "test-user",
	  "email": "test@mail.com",
	  "type": 1,
	  "posts": [
		  {"id": 1, "text": "test post 1"},
		  {"id": 2, "text": "test post 2"}
	  ],
	  "user_comments": [
		  {"id": 1, "text": "test comment 1"},
		  {"id": 2, "text": "test comment 2"}
	  ]
	}
```
```js  
  
export default {  
 methods: { 
	 async get() {  
		 const { data } = await axios.get('/api/user')  
		 this.user = new User(data)
		 
		 for post in this.user.posts {
			 console.log(post.text)
			 console.log(post instanceof Post)// true
		 }

		for comment in this.user.userComments {
			console.log(comment instanceof Comment)// true
		}
	 },

	async post() {
		/*
		* What is added to fillable and contains value is sent
		*/
		const {data} = await this.user.post('/api/user')
		this.user.update(data)
	}
	
  }
}  
```


  
### Overridable Property  
  
| methods |value  |description|
|--|--|--|
| beforePostable | null | Called before sending api
| afterPostable | res | Called after sending api

### Model Methods
|methods|args  | output|
|--|--|--|
| getPostable |null  | Object|
|update|Object|null|
|post|String|Promise
|delete|String|Promise
|patch|String|Promise
