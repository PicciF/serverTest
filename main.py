import base64
import json
import os
import re
import string
import urllib.request
from string import digits

import requests
from bs4 import BeautifulSoup
from tqdm import tqdm

from ModelRecipe import ModelRecipe

debug = False
folderRecipes = "Recipes"
listaRecipes = []
listaRecipesJson = []

def saveRecipe(linkRecipeToDownload):
    soup = downloadPage(linkRecipeToDownload)
    title = findTitle(soup)

    filePath = calculateFilePath(title)
    if os.path.exists(filePath):
        return

    ingredients = findIngredients(soup)
    description = findDescription(soup)
    category = findCategory(soup)
    imageBase64 =  "immagine"#findImage(soup)

    modelRecipe = ModelRecipe()
    modelRecipe.title = title
    modelRecipe.ingredients = ingredients
    modelRecipe.description = description
    modelRecipe.category = category
    modelRecipe.imageBase64 = imageBase64

    listaRecipes.append(modelRecipe)
    #listaRecipes.append(modelRecipe.__dict__)
    #createFileJson(modelRecipe.toDictionary(), filePath)


def findTitle(soup):
    titleRecipe = ""
    for title in soup.find_all(attrs={"class": "gz-title-recipe gz-mBottom2x"}):
        titleRecipe = title.text
    return titleRecipe


def findIngredients(soup):
    allIngredients = []
    for tag in soup.find_all(attrs={"class": "gz-ingredient"}):
        link = tag.a.get("href")
        nameIngredient = tag.a.string
        contents = tag.span.contents[0]
        quantityProduct = re.sub(r"\s+", " ", contents).strip()
        allIngredients.append([nameIngredient, quantityProduct])
    return allIngredients


def findDescription(soup):
    allDescription = ""
    for tag in soup.find_all(attrs={"class": "gz-content-recipe-step"}):
        removeNumbers = str.maketrans("", "", digits)
        if hasattr(tag.p, "text"):
            description = tag.p.text.translate(removeNumbers)
            allDescription = allDescription + description
    return allDescription


def findCategory(soup):
    for tag in soup.find_all(attrs={"class": "gz-breadcrumb"}):
        if "li" in tag: 
         category = tag.li.a.string
         return category
        else :
            for tag in soup.find_all(attrs={"class": "gz-header-special-title-content"}):
                category = tag.span.a.string
                return category
     


def findImage(soup):

    # Find the first picture tag
    pictures = soup.find("picture", attrs={"class": "gz-featured-image"})

    # Fallback: find a div with class `gz-featured-image-video gz-type-photo`
    if pictures is None:
        pictures = soup.find(
            "div", attrs={"class": "gz-featured-image-video gz-type-photo"}
        )

    imageSource = pictures.find("img")

    # Most of the times the url is in the `data-src` attribute
    imageURL = imageSource.get("data-src")

    # Fallback: if not found in `data-src` look for the `src` attr
    # Most likely, recipes which have the `src` attr
    # instead of the `data-src` one
    # are the older ones.
    # As a matter of fact, those are the ones enclosed
    # in <div> tags instead of <picture> tags (supported only on html5 and onward)
    if imageURL is None:
        imageURL = imageSource.get("src")

    imageToBase64 = str(base64.b64encode(requests.get(imageURL).content))
    imageToBase64 = imageToBase64[2 : len(imageToBase64) - 1]
    return imageToBase64


def calculateFilePath(title):
    compact_name = title.replace(" ", "_").lower()
    return folderRecipes + "/" + compact_name + ".json"


def createFileJson(data, path):
    with open(path, "w") as file:
        file.write(json.dumps(data, ensure_ascii=False))


def downloadPage(linkToDownload):
    #to resolve timeout error
    #import requests
    #from requests.adapters import HTTPAdapter
    #from urllib3.util.retry import Retry


    #session = requests.Session()
    #retry = Retry(connect=3, backoff_factor=0.5)
    #adapter = HTTPAdapter(max_retries=retry)
    #session.mount('http://', adapter)
    #session.mount('https://', adapter)

    response = requests.get(linkToDownload)
    soup = BeautifulSoup(response.text, "html.parser")
    return soup


def downloadAllRecipesFromGialloZafferano():
    totalPages = countTotalPages() + 1
    totalPages = 2
    # for pageNumber in range(1,totalPages):
    for pageNumber in tqdm(range(1, totalPages), desc="pages…", ascii=False, ncols=75):
        linkList = "https://www.giallozafferano.it/ricette-cat/page" + str(pageNumber)
        response = requests.get(linkList)
        soup = BeautifulSoup(response.text, "html.parser")
        for tag in soup.find_all(attrs={"class": "gz-title"}):
            link = tag.a.get("href")
            saveRecipe(link)
            if debug:
                break

        if debug:
            break


    #print("Total recipes: " + str(len(listaRecipes)))
    #print(listaRecipes)console.log("Data from python: " + JSON.parse(data));
    for i in range(0, len(listaRecipes)):
        #print(json.dumps(listaRecipes[i].toJSON()))
        listaRecipesJson.append(listaRecipes[i].toJSON())
    stringa = ""
    for l in listaRecipesJson:
        stringa = stringa + json.dumps(l) + "#" 
     #print (json.dumps(listaRecipes[0].toJSON()))
    print(stringa)

def countTotalPages():
    numberOfPages = 0
    linkList = "https://www.giallozafferano.it/ricette-cat"
    response = requests.get(linkList)
    soup = BeautifulSoup(response.text, "html.parser")
    for tag in soup.find_all(attrs={"class": "disabled total-pages"}):
        numberOfPages = int(tag.text)
    return numberOfPages


if __name__ == "__main__":
    if not os.path.exists(folderRecipes):
        os.makedirs(folderRecipes)
    downloadAllRecipesFromGialloZafferano()