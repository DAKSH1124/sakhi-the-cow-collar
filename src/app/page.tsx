import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Activity, ShieldAlert, MapPin, Cpu, TrendingUp, Cloud } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border/40 backdrop-blur-md bg-background/60 sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2" href="/">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            S
          </div>
          <span className="font-bold text-xl tracking-tight">Sakhi</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#how-it-works">
            How It Works
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#hardware">
            Hardware
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex">
              Dashboard Login
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 lg:py-48 xl:py-56 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background pointer-events-none" />
          <div className="container px-4 md:px-6 relative z-10 mx-auto max-w-6xl">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                  Introducing Sakhi V1
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                  Smarter Livestock.<br /> Healthier Cattle.<br /> Safer Farms.
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  The AI-powered IoT smart collar that continuously monitors health, tracks location, and prevents theft. Protect your herd with real-time alerts.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/dashboard">
                  <Button size="lg" className="h-12 px-8 font-semibold rounded-full shadow-lg shadow-primary/20">
                    Enter Dashboard
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg" className="h-12 px-8 font-semibold rounded-full">
                    Explore Features
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-32 bg-secondary/30">
          <div className="container px-4 md:px-6 mx-auto max-w-6xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Comprehensive Monitoring</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Sakhi provides everything you need to ensure the well-being of your cattle in one unified platform.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-10">
              {/* Feature 1 */}
              <div className="group relative overflow-hidden rounded-3xl bg-background p-8 border shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Heart Rate</h3>
                <p className="text-muted-foreground">
                  Continuously monitors the pulse of the cow. Detects abnormal heart rates and alerts you instantly.
                </p>
              </div>
              {/* Feature 2 */}
              <div className="group relative overflow-hidden rounded-3xl bg-background p-8 border shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Temperature</h3>
                <p className="text-muted-foreground">
                  Infrared sensors detect fever or sudden drops in body temperature for early disease detection.
                </p>
              </div>
              {/* Feature 3 */}
              <div className="group relative overflow-hidden rounded-3xl bg-background p-8 border shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">GPS Tracking</h3>
                <p className="text-muted-foreground">
                  Live location tracking with route history. Never lose a cow again if they wander off.
                </p>
              </div>
              {/* Feature 4 */}
              <div className="group relative overflow-hidden rounded-3xl bg-background p-8 border shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShieldAlert className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Anti-Theft</h3>
                <p className="text-muted-foreground">
                  Conductive wire loop detects tampering. If the collar is cut, an immediate alert is generated.
                </p>
              </div>
              {/* Feature 5 */}
              <div className="group relative overflow-hidden rounded-3xl bg-background p-8 border shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Cpu className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI Analysis</h3>
                <p className="text-muted-foreground">
                  Predictive health algorithms analyze sensor history to forecast abnormalities before they become severe.
                </p>
              </div>
              {/* Feature 6 */}
              <div className="group relative overflow-hidden rounded-3xl bg-background p-8 border shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Cloud className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Cloud Dashboard</h3>
                <p className="text-muted-foreground">
                  Real-time data synchronization with our custom backend. Access health reports and stats from any device.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6 mx-auto max-w-6xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  A seamless flow from hardware sensors to actionable insights on your dashboard.
                </p>
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="relative border-l border-primary/30 ml-3 md:ml-6 space-y-12">
                {/* Step 1 */}
                <div className="relative pl-8 md:pl-12">
                  <div className="absolute -left-[1.3rem] md:-left-[1.65rem] top-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-background bg-primary">
                    <span className="text-primary-foreground font-bold text-sm">1</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Collar Collects Data</h3>
                  <p className="text-muted-foreground">
                    Sensors (MAX30102, MLX90614, GPS) continuously monitor the cow's vitals and location in real-time.
                  </p>
                </div>
                
                {/* Step 2 */}
                <div className="relative pl-8 md:pl-12">
                  <div className="absolute -left-[1.3rem] md:-left-[1.65rem] top-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-background bg-primary">
                    <span className="text-primary-foreground font-bold text-sm">2</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">ESP32 Processing</h3>
                  <p className="text-muted-foreground">
                    The onboard ESP32 microcontroller processes the raw sensor data and formats it for transmission.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="relative pl-8 md:pl-12">
                  <div className="absolute -left-[1.3rem] md:-left-[1.65rem] top-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-background bg-primary">
                    <span className="text-primary-foreground font-bold text-sm">3</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Cloud Storage & AI</h3>
                  <p className="text-muted-foreground">
                    Data is transmitted to the custom backend via WiFi/GSM, stored securely in the database, and analyzed by AI for anomalies.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="relative pl-8 md:pl-12">
                  <div className="absolute -left-[1.3rem] md:-left-[1.65rem] top-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-background bg-primary">
                    <span className="text-primary-foreground font-bold text-sm">4</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Instant Action</h3>
                  <p className="text-muted-foreground">
                    The dashboard updates in real-time, and if critical conditions are met, immediate SMS alerts are sent via the SIM800L module.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hardware Section */}
        <section id="hardware" className="w-full py-20 md:py-32 bg-secondary/30">
          <div className="container px-4 md:px-6 mx-auto max-w-6xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Hardware & Circuitry</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Deep dive into the electronics powering the Sakhi Smart Collar.
                </p>
              </div>
            </div>
            
            <div className="space-y-12 max-w-5xl mx-auto">
              {/* Overall Block Diagram */}
              <div className="bg-background rounded-3xl p-8 border shadow-sm hover:shadow-md transition-all">
                <h3 className="text-2xl font-bold mb-4 text-center">Overall Block Diagram</h3>
                <div className="bg-muted/50 p-6 rounded-xl overflow-x-auto font-mono text-sm whitespace-pre flex justify-center">
{`                   Li-ion Battery
                         |
          +--------------+--------------+
          |                             |
      3.3V Regulator              4.0V Supply
          |                             |
        ESP32 ---------------------- SIM800L
          |
   +------+------+------+------+
   |             |             |
MAX30102     MLX90614      GPS NEO-6M
(I²C 21/22)  (I²C 25/26)   UART 16/17
          |
 Conductive Wire
   (GPIO4 Input)`}
                </div>
              </div>

              {/* Pin Mapping Table */}
              <div className="bg-background rounded-3xl p-8 border shadow-sm hover:shadow-md transition-all overflow-hidden">
                <h3 className="text-2xl font-bold mb-4">ESP32 Pin Mapping</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 rounded-tl-lg">Component</th>
                        <th className="px-6 py-3">ESP32 Pin</th>
                        <th className="px-6 py-3 rounded-tr-lg">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr className="hover:bg-muted/30"><td className="px-6 py-4 font-medium">MAX30102 VCC/GND</td><td className="px-6 py-4">3.3V / GND</td><td className="px-6 py-4">Use 3.3V only, Common Ground</td></tr>
                      <tr className="hover:bg-muted/30"><td className="px-6 py-4 font-medium">MAX30102 SDA/SCL</td><td className="px-6 py-4">GPIO 21 / 22</td><td className="px-6 py-4">I²C Bus</td></tr>
                      <tr className="hover:bg-muted/30"><td className="px-6 py-4 font-medium">MLX90614 VCC/GND</td><td className="px-6 py-4">3.3V / GND</td><td className="px-6 py-4">Works on 3.3V</td></tr>
                      <tr className="hover:bg-muted/30"><td className="px-6 py-4 font-medium">MLX90614 SDA/SCL</td><td className="px-6 py-4">GPIO 25 / 26</td><td className="px-6 py-4">Second I²C Bus</td></tr>
                      <tr className="hover:bg-muted/30"><td className="px-6 py-4 font-medium">GPS NEO-6M TX/RX</td><td className="px-6 py-4">GPIO 16 / 17</td><td className="px-6 py-4">UART (Serial2)</td></tr>
                      <tr className="hover:bg-muted/30"><td className="px-6 py-4 font-medium">SIM800L TX/RX</td><td className="px-6 py-4">GPIO 18 / 19</td><td className="px-6 py-4">Hardware/Software UART</td></tr>
                      <tr className="hover:bg-muted/30"><td className="px-6 py-4 font-medium">Conductive Wire</td><td className="px-6 py-4">GPIO 4</td><td className="px-6 py-4">Digital Input (Tamper Detection)</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Module Details Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* SIM800L */}
                <div className="bg-background rounded-3xl p-6 border shadow-sm hover:shadow-md transition-all">
                  <h4 className="text-xl font-bold mb-3 flex items-center gap-2"><Cpu className="h-5 w-5 text-primary"/> SIM800L GSM</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    <span className="font-semibold text-destructive">Important:</span> The SIM800L should not be powered directly from the ESP32's 3.3V pin. It requires a stable supply around 3.7–4.2 V and can draw current spikes of up to 2 A during transmission.
                  </p>
                  <ul className="text-sm space-y-2 font-mono bg-muted/50 p-4 rounded-xl text-muted-foreground">
                    <li>VCC <span className="text-primary">→</span> 4.0V Battery/Regulator</li>
                    <li>GND <span className="text-primary">→</span> Common Ground</li>
                    <li>TXD <span className="text-primary">→</span> GPIO18</li>
                    <li>RXD <span className="text-primary">→</span> GPIO19</li>
                  </ul>
                </div>

                {/* Battery System */}
                <div className="bg-background rounded-3xl p-6 border shadow-sm hover:shadow-md transition-all">
                  <h4 className="text-xl font-bold mb-3 flex items-center gap-2"><Activity className="h-5 w-5 text-primary"/> Battery System</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Because the SIM800L draws high peak currents, use short, thick power traces or wires and place a large low-ESR capacitor (e.g., around 1000 µF) close to its power input.
                  </p>
                  <ul className="text-sm space-y-2 font-mono bg-muted/50 p-4 rounded-xl text-muted-foreground">
                    <li>Li-ion Battery</li>
                    <li>  <span className="text-primary">↳</span> TP4056 Charging Module</li>
                    <li>  <span className="text-primary">↳</span> Protection Circuit</li>
                    <li>  <span className="text-primary">↳</span> 4.0V Regulator (SIM800L)</li>
                    <li>  <span className="text-primary">↳</span> 3.3V Regulator (ESP32)</li>
                  </ul>
                </div>

                {/* Tamper Detection */}
                <div className="bg-background rounded-3xl p-6 border shadow-sm hover:shadow-md transition-all md:col-span-2">
                  <h4 className="text-xl font-bold mb-3 flex items-center gap-2"><ShieldAlert className="h-5 w-5 text-primary"/> Conductive Wire Tamper Detection</h4>
                  <div className="grid md:grid-cols-2 gap-6 items-center">
                    <div className="bg-muted/50 p-4 rounded-xl font-mono text-sm whitespace-pre flex justify-center text-muted-foreground">
{`3.3V
 │
10kΩ Pull-down
 │
GPIO4 ── Wire ── 3.3V`}
                    </div>
                    <div className="text-sm space-y-2 flex flex-col justify-center">
                      <p><strong>Operation:</strong></p>
                      <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                        <li>Wire intact <span className="text-primary font-bold">→</span> GPIO reads HIGH.</li>
                        <li>Wire cut <span className="text-destructive font-bold">→</span> GPIO reads LOW.</li>
                        <li>ESP32 immediately triggers SMS alert, GPS location transmission, and Dashboard notification.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </section>

      </main>
      
      {/* Footer */}
      <footer className="w-full border-t border-border/40 py-6 md:py-0">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 md:px-6 max-w-6xl">
          <p className="text-sm leading-loose text-center text-muted-foreground md:text-left">
            © 2026 Sakhi Smart Collar. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4 text-muted-foreground">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4 text-muted-foreground">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
