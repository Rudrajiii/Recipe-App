## How did i push this repo - >

- git init
- git add .
- git commit -m 'recipe app'
- git remote add origin '<https://github.com/Rudrajiii/Recipe-App>'
- git push -u origin master

So now it will create a new branch called master 
basically for development purposes.

## Now if i want to merge the codes in the main branch;
- git branch

it will show how many branches you have currently

- git checkout main

it is used to switch in different branches

- git status
- git checkout master
- git merge main
after this command if you encounter a <Error> like
'<fatal: refusing to merge unrelated histories>'

then run this command below :
- git merge main --allow-unrelated-histories

now again 
- git merge main
- git push origin master

now you can push the changes into the 
main branch through github UI.