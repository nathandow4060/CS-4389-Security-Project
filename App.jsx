 App.jsx
import { useState, useEffect } from react;

 Mock data
const games = [
  { id 1, name Elden Ring, price 59.99, topSeller true, img httpsvia.placeholder.com300x180text=Elden+Ring },
  { id 2, name Starfield, price 69.99, topSeller true, img httpsvia.placeholder.com300x180text=Starfield },
  { id 3, name Spider-Man 2, price 59.99, topSeller true, img httpsvia.placeholder.com300x180text=Spider-Man+2 },
  { id 4, name Zelda Tears of the Kingdom, price 69.99, topSeller false, img httpsvia.placeholder.com300x180text=Zelda+Tears+of+the+Kingdom },
  { id 5, name God of War Ragnarok, price 59.99, topSeller false, img httpsvia.placeholder.com300x180text=God+of+War+Ragnarok },
  { id 6, name Cyberpunk 2077, price 49.99, topSeller false, img httpsvia.placeholder.com300x180text=Cyberpunk+2077 },
];

function App() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState();
  const [carouselIndex, setCarouselIndex] = useState(0);

  const topSellers = games.filter(g = g.topSeller);
  const filteredGames = games.filter(g = g.name.toLowerCase().includes(searchTerm.toLowerCase()));

   Carousel auto-rotate
  useEffect(() = {
    const interval = setInterval(() = {
      setCarouselIndex(prev = (prev + 1) % topSellers.length);
    }, 4000);
    return () = clearInterval(interval);
  }, [topSellers.length]);

  const addToCart = (game) = setCart(prev = [...prev, game]);

  return (
    div className=bg-gray-900 text-gray-100 min-h-screen
      { Header }
      header className=flex flex-wrap items-center justify-between px-8 py-4 bg-gray-800 shadow-md
        h1 className=text-3xl font-bold text-indigo-400GameHubh1
        div className=flex items-center gap-4
          CartButton cart={cart} 
        div
      header

      main className=p-8

        { Top Sellers Carousel }
        section className=mb-10 relative
          h2 className=text-2xl font-semibold mb-4 text-center🔥 Top Sellersh2
          div className=relative w-full overflow-hidden rounded-xl shadow-lg
            div className=flex transition-transform duration-700 ease-in-out style={{ transform `translateX(-${carouselIndex  100}%)` }}
              {topSellers.map(game = (
                div key={game.id} className=min-w-full flex-shrink-0 relative
                  img src={game.img} alt={game.name} className=w-full h-64 object-cover 
                  div className=absolute bottom-0 bg-gradient-to-t from-black70 to-transparent p-4
                    h3 className=text-xl font-semibold{game.name}h3
                    p className=text-indigo-400 font-bold${game.price}p
                  div
                div
              ))}
            div
            { Controls }
            button onClick={() = setCarouselIndex((carouselIndex - 1 + topSellers.length) % topSellers.length)}
              className=absolute top-12 left-4 -translate-y-12 bg-gray-80060 hoverbg-gray-800 text-white rounded-full p-3
              &#10094;
            button
            button onClick={() = setCarouselIndex((carouselIndex + 1) % topSellers.length)}
              className=absolute top-12 right-4 -translate-y-12 bg-gray-80060 hoverbg-gray-800 text-white rounded-full p-3
              &#10095;
            button
            { Indicators }
            div className=absolute bottom-3 left-12 transform -translate-x-12 flex space-x-2
              {topSellers.map((_, i) = (
                span key={i} className={`w-3 h-3 bg-white rounded-full ${i === carouselIndex  opacity-60  opacity-30}`}
                  onClick={() = setCarouselIndex(i)}span
              ))}
            div
          div
        section

        { Search }
        div className=flex justify-center mb-8
          input type=text placeholder=Search games... value={searchTerm} onChange={e = setSearchTerm(e.target.value)}
            className=w-full max-w-md px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focusoutline-none focusring-2 focusring-indigo-500 
        div

        { Catalogue }
        section
          h2 className=text-2xl font-semibold mb-6 text-center🎮 Game Catalogueh2
          div className=grid grid-cols-1 smgrid-cols-2 mdgrid-cols-3 lggrid-cols-4 gap-6
            {filteredGames.map(game = (
              div key={game.id} className=bg-gray-800 rounded-xl shadow-lg overflow-hidden hovershadow-indigo-50050 transform transition hover-translate-y-2 hoverscale-105 cursor-pointer
                img src={game.img} alt={game.name} className=w-full h-48 object-cover 
                div className=p-4
                  h3 className=text-lg font-semibold{game.name}h3
                  p className=text-sm text-gray-400Product ID {game.id}p
                  p className=text-indigo-400 font-bold mt-2${game.price}p
                  button onClick={() = addToCart(game)} className=addToCart bg-indigo-600 hoverbg-indigo-700 mt-3 px-3 py-1.5 rounded-lg text-sm font-medium w-full
                    Add to Cart
                  button
                div
              div
            ))}
          div
        section
      main
    div
  );
}

 Cart Button + Modal
function CartButton({ cart }) {
  const [open, setOpen] = useState(false);
  const total = cart.reduce((acc, g) = acc + g.price, 0);
  return (
    
      button onClick={() = setOpen(true)} className=relative bg-indigo-600 hoverbg-indigo-700 px-4 py-2 rounded-lg text-white flex items-center gap-2
        🛒 Cart
        span className=absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full{cart.length}span
      button

      {open && (
        div className=fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50
          div className=bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md
            h2 className=text-2xl font-bold mb-4 text-indigo-400Your Carth2
            ul className=space-y-2 mb-4 max-h-60 overflow-y-auto
              {cart.map((item, i) = (
                li key={i} className=flex justify-between bg-gray-700 rounded-lg px-3 py-2
                  span{item.name}span
                  span${item.price.toFixed(2)}span
                li
              ))}
            ul
            p className=text-lg font-semibold mb-4Total ${total.toFixed(2)}p
            div className=flex justify-end gap-4
              button onClick={() = setOpen(false)} className=px-4 py-2 rounded-lg bg-gray-600 hoverbg-gray-700Closebutton
              button className=px-4 py-2 rounded-lg bg-indigo-600 hoverbg-indigo-700 text-whiteCheckoutbutton
            div
          div
        div
      )}
    
  );
}

export default App;
