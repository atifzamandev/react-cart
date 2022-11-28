import React, { useEffect } from "react"
import { useState } from "react"
import { useQuery } from "react-query"
//Components
import Item from "./Components/Item"
import Cart from "./Components/Cart/Cart"
import Drawer from "@mui/material/Drawer"
import LinearProgress from "@mui/material/LinearProgress"
import Grid from "@mui/material/Grid"
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart"
import { Badge } from "@mui/material"

//Styles
import { StyledButton, Wrapper } from "./App.styles"
import { CartItemType, getProducts } from "./Api/getProducts"

const App = () => {
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([] as CartItemType[])
  const { data, isLoading, error } = useQuery<CartItemType[]>(
    "products",
    getProducts
  )

  function preventKeyBoardScroll(e:any) {
    e.preventDefault();
    e.stopPropagation();
    document.documentElement.style.overflow = 'hidden';
    return false;
}
  function releaseKeyBoardScroll(e:any) {

    document.documentElement.style.overflow = 'atuo';
    return false;
}

  useEffect(() => {
    if (cartOpen) {
      document.documentElement.style.overflowY = "hidden"
      document.addEventListener("touchstart", preventKeyBoardScroll, false )
      document.addEventListener("touchmove", preventKeyBoardScroll, false  )
      document.addEventListener("ontouchstart", preventKeyBoardScroll, false  )
      document.addEventListener("scroll", preventKeyBoardScroll, false  )
    } else {
       document.documentElement.style.overflow = 'auto';
       document.documentElement.removeAttribute("style")
    }
  }, [cartOpen])

  console.log(data?.map((item) => item.title))

  const getTotalItems = (items: CartItemType[]) =>
    items.reduce((ack: number, item) => ack + item.amount, 0)

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems((prev) => {
      const isItemInCart = prev.find((item) => item.id === clickedItem.id)

      if (isItemInCart) {
        return prev.map((item) =>
          item.id === clickedItem.id
            ? { ...item, amount: item.amount + 1 }
            : item
        )
      }

      return [...prev, {...clickedItem, amount: 1} ];

    });
  }

  const handleRemoveFromCart = (id: number) => {

    setCartItems(prev =>(
        prev.reduce((ack, item)=>{
          if(item.id===id){
            if(item.amount ===1) return ack;
            return [...ack, {...item, amount: item.amount-1}];
          } else {
            return [...ack, item];
          }
        }, [] as CartItemType[] )
    ))
  };

  if (isLoading) return <LinearProgress />
  if (error) return <h1>There is something wrong...</h1>

  return (
    <Wrapper>
      <Drawer style={{height: "200px"}} anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Cart
          cartItems={cartItems}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
        />
      </Drawer>
      <StyledButton onClick={() => setCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color="error">
          <AddShoppingCartIcon />
        </Badge>
      </StyledButton>
      <Grid container spacing={3}>
        {data?.map((item) => (
          <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
            <Item item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  )
}

export default App
