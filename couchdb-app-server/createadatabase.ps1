param (
    [Parameter(Mandatory=$true)][string]$database,
    [Parameter(Mandatory=$true)][string]$username,
    [Parameter(Mandatory=$true)][string]$password)
clear 
echo "This is a shell script to initialize a database"
Write-Host "Database: $database" 
Write-Host "Username: $username"
Write-Host "Password: $password"
$URL="http://${username}:$password@localhost:5984/$database"
Write-Host "Hi, $url"

$CURLEXE = Get-Command curl.exe

# delete the database
$CurlArgument = '-X', 'DELETE',$URL
Write-Host "CurlArgument, $CurlArgument"
& $CURLEXE @CurlArgument

# create the database
$CurlArgument = '-X', 'PUT',$URL
Write-Host "CurlArgument, $CurlArgument"
& $CURLEXE @CurlArgument

# create documents
$URLDOC="$URL/79ae34a9-0d24-40d6-bd2a-a8898a54b09f"
Write-Host "NEWS1 $URLDOC"
$JSON ='{ \"type\": \"news\",
  \"title\": \"First News for Testing\",
  \"author\": \"JeepQ\",
  \"ellipsis\": \"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam blandit dolor libero, id scelerisque risus mollis ut. Proin tempus fermentum ...\",
  \"display\": true,
  \"dateCreated\": \"2018-03-06T14:41:14.349Z\",
  \"dateUpdated\": \"2018-03-06T14:41:14.349Z\"
}'
$CurlArgument = '-X', 'PUT',$URLDOC,'-H', '"Expect:"',
'-H', '"Content-Type: application/json; charset=utf-8"',
'-d', $JSON
& $CURLEXE @CurlArgument
$URLDOC="$URL/7e8a3232-8d73-4ca2-9123-263f80540e20"
Write-Host "NEWS2 $URLDOC"
$JSON ='{ \"type\": \"news\",
  \"title\": \"Second News for Testing\",
  \"author\": \"JeepQ\",
  \"ellipsis\": \"Proin aliquam at orci ac tristique. Praesent rhoncus eleifend dolor, condimentum congue sapien faucibus vitae. Nullam id mauris mauris. Nullam ...\",
  \"display\": true,
  \"dateCreated\": \"2018-03-06T14:41:52.885Z\",
  \"dateUpdated\": \"2018-03-06T14:41:52.885Z\"
}'
$CurlArgument = '-X', 'PUT',$URLDOC,'-H', '"Expect:"',
'-H', '"Content-Type: application/json; charset=utf-8"',
'-d', $JSON
& $CURLEXE @CurlArgument
$URLDOC="$URL/f898bd6a-b57e-47f1-82ce-3616b7fe17d0"
Write-Host "NEWS3 $URLDOC"
$JSON ='{ \"type\": \"news\",
  \"title\": \"Third News for Testing\",
  \"author\": \"JeepQ\",
  \"ellipsis\": \"Phasellus a dignissim augue. Vivamus eu urna eget elit efficitur sollicitudin at ut massa. Aliquam consectetur mi at massa facilisis ...\",
  \"display\": true,
  \"dateCreated\": \"2018-03-06T14:42:18.957Z\",
  \"dateUpdated\": \"2018-03-06T14:42:18.957Z\"
}'
$CurlArgument = '-X', 'PUT',$URLDOC,'-H', '"Expect:"',
'-H', '"Content-Type: application/json; charset=utf-8"',
'-d', $JSON
& $CURLEXE @CurlArgument

# create document text attachement
$URLDOC="$URL/79ae34a9-0d24-40d6-bd2a-a8898a54b09f/content.text?rev=1-40c1f89797164b1537423fc5826ff57c"
$CurlArgument =  '-X', 'PUT', $URLDOC ,
'-H', '"Content-Type: text/plain"', '-d' ,'@news1.txt'
& $CURLEXE @CurlArgument
$URLDOC="$URL/7e8a3232-8d73-4ca2-9123-263f80540e20/content.text?rev=1-78db29fed5f9186798063ee787fbcae4"
$CurlArgument =  '-X', 'PUT', $URLDOC ,
'-H', '"Content-Type: text/plain"', '-d','@news2.txt'
& $CURLEXE @CurlArgument
$URLDOC="$URL/f898bd6a-b57e-47f1-82ce-3616b7fe17d0/content.text?rev=1-2aae39c590fbf34a62efb9781fc5bfd5"
$CurlArgument =  '-X', 'PUT', $URLDOC ,
'-H', '"Content-Type: text/plain"', '-d', '@news3.txt'
& $CURLEXE @CurlArgument

# create the design/news view
$FUNC1 ="function(doc){if(doc.type == 'news'){if(doc.display){emit(doc.dateCreated);}}}"
$FUNC2 ="function(doc){if(doc.type == 'news'){ emit(doc.dateCreated);}}"
$JSON1 = '{
    \"views\":
       { \"display_by_date_created\":
          { \"map\":'
$JSON2 = '},
         \"all_by_date_created\":
          { \"map\":' 
$JSON3 = '} },
    \"language\": \"javascript\" 
}'
$JSON =$JSON1+'\"'+$FUNC1+'\"'+$JSON2+'\"'+$FUNC2+'\"'+$JSON3
$URLDOC="$URL/_design/news"
Write-Host "NEWS DESIGN $URLDOC"
$CurlArgument =  '-X', 'PUT', $URLDOC ,
'-H', '"Expect:"',
'-H', '"Content-Type: application/json; charset=utf-8"',
'-d', $JSON
& $CURLEXE @CurlArgument
Write-Host "I am done running curl, database: $database created"  

