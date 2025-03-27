# Prerequisites

https://jekyllrb.com/docs/installation/windows/

# How to add a new document

Go to docs/_docs
Copy an existing .md file or create your own - make sure that it has the <a href="https://jekyllrb.com/docs/front-matter/">Front Matter</a>

Resources regarding markup for:
- <a href="https://jekyllrb.com/docs/liquid/tags/#code-snippet-highlighting">Code Highlighting</a>

Once your page has been created you should be able to navigate to it based on the naming of the page.

You will then need to add it to the navigation menu under docs/_data/navigation.yml

# How to test the website

Open up command prompt and navigate to the /docs subfolder
Run "bundle exec jekyll serve"

# Important Note

If you are using a later version of Ruby (>=v3), you will need to run

```bundle add webrick```

in the terminal in order to build the project locally