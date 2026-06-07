import { CartProvider } from './context/CartContext'
import Navbar        from './components/Navbar'
import Hero          from './components/Hero'
import Catalog       from './components/Catalog'
import About         from './components/About'
import Testimonials  from './components/Testimonials'
import FaqShipping   from './components/FaqShipping'
import Footer        from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import CartDrawer    from './components/CartDrawer'

export default function App() {
  return (
    <CartProvider>
      <Navbar />
      <main>
        <Hero />
        <Catalog />
        <About />
        <Testimonials />
        <FaqShipping />
        <Footer />
      </main>
      <WhatsAppFloat />
      <CartDrawer />
    </CartProvider>
  )
}
