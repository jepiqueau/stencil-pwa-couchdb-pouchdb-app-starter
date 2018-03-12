#!/bin/bash 
clear 
echo "This is a shell script to initialize a database" 
DATABASE="$1" 
ADMIN="$2"
PASSWORD="$3"
URL="http://$ADMIN:$PASSWORD@localhost:5984/$DATABASE"
echo "Hi, $URL"
# delete the database
curl -s -X DELETE $URL
# create the database
curl -s -X PUT $URL
# create some documents
URLDOC="$URL/79ae34a9-0d24-40d6-bd2a-a8898a54b09f"
echo "NEWS1 $URLDOC"
curl -X PUT $URLDOC \
-H "Expect:" \
-H 'Content-Type: text/json; charset=utf-8' \
-d @- << EOF
{ "type": "news",
  "title": "First News for Testing",
  "author": "JeepQ",
  "ellipsis": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam blandit dolor libero, id scelerisque risus mollis ut. Proin tempus fermentum ...",
  "display": true,
  "dateCreated": "2018-03-06T14:41:14.349Z",
  "dateUpdated": "2018-03-06T14:41:14.349Z"
}
EOF
echo "NEWS1 $NEWS1"


URLDOC="$URL/7e8a3232-8d73-4ca2-9123-263f80540e20"
echo "NEWS2 $URLDOC"
curl -X PUT $URLDOC \
-H "Expect:" \
-H 'Content-Type: text/json; charset=utf-8' \
-d @- << EOF
{ "type": "news",
  "title": "Second News for Testing",
  "author": "JeepQ",
  "ellipsis": "Proin aliquam at orci ac tristique. Praesent rhoncus eleifend dolor, condimentum congue sapien faucibus vitae. Nullam id mauris mauris. Nullam ...",
  "display": true,
  "dateCreated": "2018-03-06T14:41:52.885Z",
  "dateUpdated": "2018-03-06T14:41:52.885Z"
}
EOF
URLDOC="$URL/f898bd6a-b57e-47f1-82ce-3616b7fe17d0"
echo "NEWS3 $URLDOC"
curl -X PUT $URLDOC \
-H "Expect:" \
-H 'Content-Type: text/json; charset=utf-8' \
-d @- << EOF
{   "type": "news",
  "title": "Third News for Testing",
  "author": "JeepQ",
  "ellipsis": "Phasellus a dignissim augue. Vivamus eu urna eget elit efficitur sollicitudin at ut massa. Aliquam consectetur mi at massa facilisis ...",
  "display": true,
  "dateCreated": "2018-03-06T14:42:18.957Z",
  "dateUpdated": "2018-03-06T14:42:18.957Z"
}
EOF
# create document text attachement

URLDOC="$URL/79ae34a9-0d24-40d6-bd2a-a8898a54b09f/content.text?rev=1-40c1f89797164b1537423fc5826ff57c"
curl -X PUT $URLDOC \
-H "Content-Type: text/plain" -d@news1.txt

URLDOC="$URL/7e8a3232-8d73-4ca2-9123-263f80540e20/content.text?rev=1-78db29fed5f9186798063ee787fbcae4"
curl -X PUT $URLDOC \
-H "Content-Type: text/plain" -d@news2.txt

URLDOC="$URL/f898bd6a-b57e-47f1-82ce-3616b7fe17d0/content.text?rev=1-2aae39c590fbf34a62efb9781fc5bfd5"
curl -X PUT $URLDOC \
-H "Content-Type: text/plain" -d@news3.txt

# create the design/news view
URLDOC="$URL/_design/news"
echo "NEWS DESIGN $URLDOC"
curl -X PUT $URLDOC \
-H "Expect:" \
-H 'Content-Type: text/json; charset=utf-8' \
-d @- << EOF
{
"views": \
   { "display_by_date_created": \
      { "map": "function(doc){ if(doc.type == 'news'){if(doc.display){emit(doc.dateCreated)};} }" },\
     "all_by_date_created": \
      { "map": "function(doc){ if(doc.type == 'news'){emit(doc.dateCreated);}}" } },\
"language": "javascript" 
}
EOF
echo "I am done running curl"  
