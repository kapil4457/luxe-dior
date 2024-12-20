"use client";

import { productInfo } from "@/types/product";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Edit, Plus, Save, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Input } from "@/components/ui/input";
import { variantInfo } from "@/types/product";
import { ScrollArea } from "@/components/ui/scroll-area";
import { categories } from "@/data/category";
import AddNewVariant from "./AddNewVariant";
import { useToast } from "@/components/ui/use-toast";
import {
  createProductServerHandler,
  getAllProductsServerHandler,
  updateProductServerHandler,
} from "../../actions/action";

const ModifyProductInfo = ({
  productInfo,
  type,
  setItems,
}: {
  productInfo?: productInfo;
  type: string;
  setItems: React.Dispatch<React.SetStateAction<productInfo[]>>;
}) => {
  const { toast } = useToast();
  const [item, setItem] = useState<productInfo>(
    productInfo
      ? productInfo
      : {
          category: "",
          description: "",
          price: 0,
          quantity: 0,
          ratings: [],
          reviews: [],
          stock: 0,
          title: "",
          variants: [],
          variantsCount: 0,
          _id: "",
        }
  );

  const [variants, setVariants] = useState<variantInfo[]>(
    productInfo ? productInfo.variants : []
  );

  const updateProduct = async () => {
    const data: productInfo = {
      category: item.category,
      description: item.description,
      price: item.price,
      quantity: item.quantity,
      stock: item.stock,
      title: item.title,
      variantsCount: variants.length,
      variants: variants,
      productSold: item.productSold,
    };

    if (
      item.category.trim().length == 0 ||
      item.description.trim().length == 0 ||
      item.price == 0 ||
      item.quantity == 0 ||
      item.stock == 0 ||
      item.title.trim().length == 0 ||
      variants.length == 0
    ) {
      toast({
        title: "Please fill in all the details",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: type === "edit" ? "Updating..." : "Adding...",
      variant: "default",
    });

    await updateProductServerHandler({ id: item._id!, data })
      .then(async (data) => {
        if (data.success) {
          toast({
            title: data.message,
            variant: "default",
          });
          const res = await getAllProductsServerHandler();
          const products = JSON.parse(res.products!);
          setItems(products);
        } else {
          toast({
            title: data.message,
            variant: "destructive",
          });
        }
      })
      .catch((err) => {
        console.log("err : ", err);
      });
  };
  const addProduct = async () => {
    if (
      item.category.trim().length == 0 ||
      item.description.trim().length == 0 ||
      item.price == 0 ||
      item.quantity == 0 ||
      item.stock == 0 ||
      item.title.trim().length == 0 ||
      variants.length == 0
    ) {
      toast({
        title: "Please fill in all the details",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: type === "edit" ? "Updating..." : "Adding...",
      variant: "default",
    });

    await createProductServerHandler({ item, variants })
      .then(async (data) => {
        if (data.success) {
          toast({
            title: data.message,
            variant: "default",
          });

          const res = await getAllProductsServerHandler();
          const products = JSON.parse(res.products!);
          setItems(products);
          setItem({
            category: "",
            description: "",
            price: 0,
            quantity: 0,
            ratings: [],
            reviews: [],
            stock: 0,
            title: "",
            variants: [],
            variantsCount: 0,
            _id: "",
          });
        } else {
          toast({
            title: data?.message,
            variant: "destructive",
          });
        }
      })
      .catch((err) => {
        console.log("err : ", err);
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={cn(
            buttonVariants({
              size: "sm",
              variant: "secondary",
            }),
            type == "add" && "h-full flex gap-2 self-center"
          )}
        >
          {type === "edit" ? (
            <Edit className="w-5 h-5" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90%] sm:max-w-[80%] lg:max-w-[50%] edit-product-dialog">
        <DialogHeader>
          <DialogTitle>
            {type === "edit" ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[40rem]">
          <div className="flex items-center space-y-5 flex-col py-2 px-2">
            <div className="md:grid md:grid-cols-12 gap-2 w-full flex flex-col">
              <span className="col-span-2">Title</span>
              <Input
                id="title"
                className="w-full col-span-10"
                value={item?.title as string}
                onChange={(e) => setItem({ ...item, title: e.target.value })}
              />
            </div>
            <div className="md:grid md:grid-cols-12 gap-2 w-full flex flex-col">
              <span className="col-span-2">Description</span>
              <Textarea
                id="description"
                className="w-full col-span-10"
                value={item?.description}
                onChange={(e) =>
                  setItem({ ...item, description: e.target.value })
                }
              />
            </div>
            <div className="md:grid md:grid-cols-12 gap-2 w-full flex flex-col ">
              <span className="col-span-2">Price</span>
              <Input
                type="number"
                id="price"
                className="w-full col-span-10"
                value={item?.price}
                onChange={(e) =>
                  setItem({ ...item, price: e.target.valueAsNumber })
                }
              />
            </div>
            <div className="md:grid md:grid-cols-12 gap-2 w-full flex flex-col">
              <span className="col-span-2">Stock</span>
              <Input
                id="stock"
                type="number"
                className="w-full col-span-10"
                value={item?.stock}
                onChange={(e) =>
                  setItem({ ...item, stock: e.target.valueAsNumber })
                }
              />
            </div>
            <div className="md:grid md:grid-cols-12 gap-2 w-full flex flex-col">
              <span className="col-span-2">Quantity</span>
              <Input
                id="quantity"
                type="number"
                className="w-full col-span-10"
                value={item?.quantity}
                onChange={(e) =>
                  setItem({ ...item, quantity: e.target.valueAsNumber })
                }
              />
            </div>
            <div className="md:grid md:grid-cols-12 gap-2 w-full flex flex-col">
              <span className="col-span-2">Category</span>
              <Select
                onValueChange={(e) => {
                  setItem({ ...item, category: e });
                }}
              >
                <SelectTrigger className="w-full col-span-10">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent defaultValue={item?.category}>
                  {categories?.map((category, key) => (
                    <SelectItem
                      key={`item-category-${key}`}
                      value={category.value}
                    >
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:grid md:grid-cols-12 gap-2 w-full flex flex-col">
              <span className="col-span-2">Variants</span>
              <div className="col-span-10">
                <ScrollArea className="h-full px-3">
                  <AddNewVariant
                    variants={variants}
                    setVariants={setVariants}
                    setItem={setItem}
                    item={item}
                  />
                  <Accordion type="single" collapsible className="w-full ">
                    {variants?.map((variant, key1) => {
                      return (
                        <AccordionItem
                          key={`item-${`variant-${key1}`}`}
                          value={`item-${`variant-${key1}`}`}
                        >
                          <AccordionTrigger>
                            <div className="flex gap-2">
                              {variants[key1]?.name}{" "}
                              <div
                                className={cn(
                                  buttonVariants({
                                    size: "sm",
                                    variant: "destructive",
                                  }),

                                  "h-6"
                                )}
                              >
                                <Trash2
                                  className="w-4 h-4"
                                  onClick={() => {
                                    let newVariants = variants.filter(
                                      (item, newVariantFilterKey) => {
                                        if (key1 !== newVariantFilterKey)
                                          return item;
                                      }
                                    );

                                    setVariants(newVariants);
                                  }}
                                />
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="flex flex-col gap-2 px-2">
                            <div className="flex gap-2 flex-col">
                              <span>Name</span>
                              <Input
                                className="w-full col-span-10"
                                value={variants[key1]?.name}
                                onChange={(e) => {
                                  let newVariants = variants;
                                  newVariants[key1].name = e.target.value;
                                  setVariants(newVariants);
                                  setItem({ ...item, variants: newVariants });
                                }}
                              />
                            </div>
                            <div className="flex gap-2 flex-col">
                              <span>Additional Cost</span>
                              <Input
                                className="w-full col-span-10"
                                type="number"
                                value={variants[key1]?.additionalCost}
                                onChange={(e) => {
                                  let newVariants = variants;
                                  newVariants[key1].additionalCost =
                                    e.target.valueAsNumber;
                                  setVariants(newVariants);
                                  setItem({ ...item, variants: newVariants });
                                }}
                              />
                            </div>
                            <div className="flex gap-2 flex-col">
                              <span>Images</span>
                              <div className="flex flex-col gap-2 w-full">
                                <div className="flex gap-2 flex-wrap">
                                  {variants[key1]?.images?.map(
                                    (imgSrc, key2) => {
                                      return (
                                        <img
                                          className="w-10 h-10 rounded-lg cursor-pointer object-cover"
                                          src={imgSrc}
                                          key={`new-variant-img-${key2}`}
                                          onClick={() => {
                                            let newVariants = variants;
                                            let newImages = newVariants[
                                              key1
                                            ].images.filter((img) => {
                                              if (img !== imgSrc) return img;
                                            });

                                            newVariants[key1].images =
                                              newImages;
                                            setVariants(newVariants);
                                            setItem({
                                              ...item,
                                              variants: newVariants,
                                            });
                                          }}
                                        />
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </ScrollArea>
              </div>
            </div>
            <Button
              onClick={() => {
                if (type === "edit") {
                  updateProduct();
                } else {
                  addProduct();
                }
              }}
              className={cn(
                buttonVariants({
                  size: "sm",
                  variant: "secondary",
                }),
                "flex gap-2"
              )}
            >
              <span>{type === "edit" ? "Save" : "Add"}</span>
              {type === "edit" ? <Save className="w-5 h-5" /> : null}
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ModifyProductInfo;
