const express=require('express');
const ejs=require('ejs');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');

const app=express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true
  });

const articleSchema = {
    title: String,
    content: String
  };
  
  const Article = mongoose.model("Article", articleSchema);
  

  app.route("articles")
  .get(function(req,res){
    Article.find({},function(err,foundArticles){
         if(!err)
         res.send(foundArticles);

    })
})
.post(function(req,res){
    const newArticle=new Article({
        title:req.body.title,
        content:req.body.content
    });
    newArticle.save(function(err){
        if(!err)
        res.send("Successful"); 
        else
        res.send(err);
    });
})
.delete(function(req,res){
    Article.deleteMany({},function(err){
        if(!err)
        res.send( "Successfully deleted all the articles");
        else
        res.send(err);
    });
});

app.route("/articles/:articlename")
.get(function(req,res){
    const articleName=req.params.articlename;
    Article.findOne({title:articleName},function(err,foundArticles){
        if(foundArticles)
        res.send(foundArticles);
        else
        res.send("No Articles");
})


})
.put(function(req,res){
Article.update(
    {title:req.params.articlename},
    {title:req.body.title,
    content:req.body.content},
    {overwrite:true},
    function(err){
        if(!err)
        res.send("Sucessfully Updated");
    }
);

})
.patch(function(req,res){
    Article.update(
        {title:req.params.articlename},
        {$set:req.body},
    function(err){
        if(!err)
        res.send("Successfully Updated");
        else
        res.send(err);
    });
})
.delete(function(req,res){
    Article.findOneAndDelete({
        title:req.params.articlename
    },function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            console.log("Deleted User : ", docs);
        }
});
});

 
  app.listen(3000,function(){
      console.log("server started");
  })