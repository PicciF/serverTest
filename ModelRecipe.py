import json
class ModelRecipe:
    imageBase64 = ""
    title = ""
    category = ""
    description = ""
    ingredients = []
    def toJSON(self):
        return {
            "title": self.title,
            "ingredients": self.ingredients,
            "description": self.description,
            "category": self.category,
            "imageBase64": self.imageBase64
        }
