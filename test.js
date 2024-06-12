

async function f(){
      try{
            const response= await fetch('https://jsonplaceholder.typicode.com/posts')
            const post = await response.json();
            console.log(post);
            let title= post.map(data => {
                  return data.title
            });
            console.log(title);

      } catch(err){
            alert(err);
            print("eror");
      }
}   

f();