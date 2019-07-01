
  
## alcjs  
  
### Installation  
  
With npm:  
  
 npm install @team-decorate/alcjs  ### Usage  
  
#### Model create  
```js  
import {Model, ArrayMappable} from '@team-decorate/alcjs'  
import Post from './models/Post'  
import Comment from './models/Comment'  
  
const FILLABLE = [  
 'id', 'name', 'email', 'password', 'type']  
  
class User extends Model {  
  constructor(data) {  
 super()         this.fillable = FILLABLE //presents is send even if the field is empty this.presents = ['type']         this.id = 0  
 this.name = '' this.email = '' this.password = '' this.type = 0 this.posts = [] this.userComments = []         this.arrayMap(  
 new ArrayMappable(Post), new ArrayMappable(Comment).bind('userComment')  
 ) this.data = data  
 }}  
  
```  
  
#### Use Front  
```js  
  
export default {  
 methods: { async get() {  
 const { data } = await axios.get('/api/user')  
 const user = new User(data) } }}  
```  
  
### Parent Property  
  
|    methods | description |  value |
|-----------:|:-------------------------------------------| :----| 
|    `beforePostable` | Called before sending api         |  null
| `aferPostable` | Called after sending api |  res