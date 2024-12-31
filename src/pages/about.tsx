import { Navigation } from "../components/about/navigation"
import { Features } from "../components/about/features"
import { Process } from "../components/about/process"
import { Achievements } from "../components/about/achievements"
import { CTA } from "../components/about/cta"
import { Newsletter } from "../components/about/newsletter"
import { Footer } from "../components/about/footer"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="">
        {/* Hero Section */}
        <section className="relative h-[400px] flex items-center overflow-hidden">
          <img
            src="https://yzozbqmjlkfwdqywxpdt.supabase.co/storage/v1/object/sign/cars/image%2023.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJjYXJzL2ltYWdlIDIzLnBuZyIsImlhdCI6MTczNTQ4MTE4NSwiZXhwIjoxNzY3MDE3MTg1fQ.5KVNJo0HLMBYkxKKfGyNVvSWzn2Bn2u3P59x-bu0eoU&t=2024-12-29T14%3A06%3A25.262Z"
            alt="Luxury car"
            className="absolute inset-0 w-full h-full object-cover image-hover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="container relative z-10 text-white">
            <div className="flex gap-2 text-sm mb-4 animate-fade-in">
              <span>HOME</span>
              <span>/</span>
              <span>ABOUT US</span>
            </div>
            <h1 className="text-5xl font-bold mb-6 animate-slide-in">Who We Are</h1>
          </div>
        </section>

        {/* Partner Logos */}
        <section className="py-12 border-y">
          <div className="container">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-centerjustify-center ">
              {[
                'https://upload.wikimedia.org/wikipedia/commons/f/f4/BMW_logo_%28gray%29.svg',
                'https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg',
                'https://yzozbqmjlkfwdqywxpdt.supabase.co/storage/v1/object/sign/cars/Vector.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJjYXJzL1ZlY3Rvci5wbmciLCJpYXQiOjE3MzU0Nzg1OTksImV4cCI6MTc2NzAxNDU5OX0.tfV9Rbfgg3NYWbM-pC-vX0HUjNK5amTsPn4XSXtmMIY&t=2024-12-29T13%3A23%3A19.507Z',
                'https://upload.wikimedia.org/wikipedia/en/8/8c/Porsche_logo.svg',
                'https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.svg',
                'https://upload.wikimedia.org/wikipedia/commons/3/38/Honda.svg'
              ].map((src, i) => (
                <div key={i} className="flex items-center justify-center">
                  <img
                    src={src}
                    alt={`Partner logo ${i + 1}`}
                    className="h-[51px] w-[144px] opacity-50 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Journey Section */}
        <section className="py-24 bg-secondary">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-slide-in">
                <Button className="mb-8 bg-primary hover:bg-primary/90 text-primary-foreground button-hover">
                  PICK THE CAR!
                </Button>
                <div className="space-y-6">
                  <h2 className="text-4xl font-bold">OUR JOURNEY</h2>
                  <h3 className="text-3xl font-bold text-primary">
                    Pioneering Premium Car Rentals
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Drivoxe embarked on a remarkable journey over a decade ago, driven by a
                    relentless passion for redefining the travel experience. From the outset, our mission
                    was clear: To provide the best available and exceptional service to make every
                    journey unforgettable. We've upheld our commitment to delivering quality and
                    variety, offering a diverse range of meticulously maintained vehicles to
                    ensure you always drive in style.
                  </p>
                </div>
              </div>
              <div className="animate-scale-in animate-delay-200">
                <img
                  src="https://yzozbqmjlkfwdqywxpdt.supabase.co/storage/v1/object/sign/cars/image1.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJjYXJzL2ltYWdlMS5wbmciLCJpYXQiOjE3MzU2NDc2NTYsImV4cCI6MTc2NzE4MzY1Nn0.1TQwVFvTfKjG88LXXaRId19N7xW07XN95gIJgeAPKWo&t=2024-12-31T12%3A20%3A55.666Z"
                  alt="Red BMW sedan"
                  className="rounded-lg w-full image-hover"
                />
              </div>
            </div>
          </div>
        </section>

        <Features />
        <Process />
        <Achievements />
        <CTA />
        <Newsletter />
        <Footer />
      </main>
    </div>
  )
}
