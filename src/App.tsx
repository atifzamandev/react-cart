import React, { useEffect, useLayoutEffect, useRef } from "react"
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

//   function preventKeyBoardScroll(e:any) {
//     e.preventDefault();
//     e.stopPropagation();
//     document.documentElement.style.overflow = 'hidden';
//     document.body.style.paddingBottom = 'env(safe-area-inset-bottom)'
//     return false;
// }
//   function releaseKeyBoardScroll(e:any) {
//     document.documentElement.removeAttribute("style")
//     document.documentElement.style.overflow = 'atuo';
//     return false;
// }

const scrollX = window.scrollX;
const scrollY = window.scrollY;


const [scrollPosition, setPosition] = useState(0);
const scrollPos = useRef(0);

      

  useLayoutEffect(() => {
    function updatePosition() {
      setPosition(window.pageYOffset);
    }
    window.addEventListener('scroll', updatePosition);
    updatePosition();
    return () => window.removeEventListener('scroll', updatePosition);
  }, [cartOpen]);

  
  console.log (scrollPosition);
  scrollPos.current = scrollPosition
useEffect(() => {
  if (cartOpen) { 
    
    console.log(scrollPos.current)
    document.documentElement.style.cssText = 'overflow: hidden; min-height: 100vh'
    document.body.style.cssText = "position:fixed"
    if (window.innerWidth < 600) {
      document.body.style.cssText = "overflow-anchor: none;"
    }
    
    // document.addEventListener("touchmove", preventKeyBoardScroll, false  )
    // document.addEventListener("ontouchstart", preventKeyBoardScroll, false  )
    //  document.addEventListener("scroll", preventKeyBoardScroll, false  )
  } else {
    document.documentElement.removeAttribute("style")
    document.body.removeAttribute("style")
    //window.scrollTo(0, scrollPos.current)
    //  document.documentElement.style.overflow = 'auto';
    // document.addEventListener("touchstart", releaseKeyBoardScroll, false )
    //  document.addEventListener("touchmove", releaseKeyBoardScroll, false  )
    //  document.addEventListener("ontouchstart", releaseKeyBoardScroll, false  )
    //  document.removeEventListener("scroll", releaseKeyBoardScroll, false  )
  }
}, [cartOpen])







  

  

  console.log(data?.map((item) => item.title))
  console.log("posted")

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
      <Drawer style={{height: "200px"}} anchor="right" open={cartOpen} onClose={() => setCartOpen(false)} disableScrollLock={true}>
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
