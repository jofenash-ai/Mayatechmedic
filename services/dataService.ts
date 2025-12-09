import { Product, Course, User } from '../types';

let nextProductId = 125; // Starting ID for new products
let nextCourseId = 205; // Starting ID for new courses
let nextUserId = 1; // Starting ID for new users
let nextOrderId = 1001; // Starting ID for new orders

// FIX: Export `generateUniqueId`
export const generateUniqueId = (prefix: string) => {
  if (prefix === 'p') {
    return `${prefix}${nextProductId++}`;
  } else if (prefix === 'c') {
    return `${prefix}${nextCourseId++}`;
  } else if (prefix === 'u') {
    return `${prefix}${nextUserId++}`;
  } else if (prefix === 'o') {
    return `${prefix}${nextOrderId++}`;
  }
  return `${prefix}${Date.now()}`;
};

// --- Mock Backend Simulation Helpers ---
const _delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- User Management (Mock Backend) ---
const USERS_STORAGE_KEY = 'mayatech_users';

export const _getUsersFromLocalStorage = (): User[] => {
  const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

export const _saveUsersToLocalStorage = (users: User[]): void => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const findUserByEmail = async (email: string): Promise<User | undefined> => {
  await _delay(300); // Simulate network delay
  const users = _getUsersFromLocalStorage();
  return users.find((u) => u.email === email);
};

export const registerUser = async (email: string, password: string, name: string): Promise<{ user: User; token: string }> => {
  await _delay(1000); // Simulate network delay

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error('User with this email already exists.');
  }

  const role = email === 'admin@lele.com' && password === 'admin' ? 'admin' : 'user'; // Updated for LELE
  const newUser: User = {
    id: generateUniqueId('u'),
    email,
    name,
    role,
    enrolledCourseIds: [],
    orders: [],
  };

  const users = _getUsersFromLocalStorage();
  // FIX: Cast the user object with password to `any` to allow storing the password in the mock user object.
  _saveUsersToLocalStorage([...users, { ...newUser, password } as any]); // Store password for mock checking
  return { user: newUser, token: `mock-jwt-token-${newUser.id}` };
};

export const authenticateUser = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  await _delay(700); // Simulate network delay

  const users = _getUsersFromLocalStorage();
  const foundUser = users.find((u) => u.email === email && (u as any).password === password); // Mock password check

  if (!foundUser) {
    throw new Error('Invalid email or password.');
  }

  // Return user without password
  const userWithoutPassword = { ...foundUser };
  delete (userWithoutPassword as any).password;

  return { user: userWithoutPassword, token: `mock-jwt-token-${foundUser.id}` };
};


// --- Product Data (Persistent Mock) ---
const PRODUCTS_STORAGE_KEY = 'mayatech_products';
let _products: Product[] = [];

const _initialProducts: Product[] = [
  {
    id: 'p101',
    name: 'Arduino Uno R3',
    description: 'The Arduino Uno R3 is a microcontroller board based on the ATmega328P. It has 14 digital input/output pins (of which 6 can be used as PWM outputs), 6 analog inputs, a 16 MHz ceramic resonator, a USB connection, a power jack, an ICSP header, and a reset button. It contains everything needed to support the microcontroller; simply connect it to a computer with a USB cable or power it with an AC-to-DC adapter or battery to get started.',
    price: 24.99,
    imageUrl: 'https://picsum.photos/400/300?random=1',
    category: 'Microcontrollers',
    stock: 50,
    rating: 4.8,
    reviews: 120,
    condition: 'New',
  },
  {
    id: 'p102',
    name: 'Raspberry Pi 4 Model B (4GB RAM)',
    description: 'A powerful single-board computer, ideal for DIY electronics, home automation, and media centers. Features 4GB LPDDR4-3200 SDRAM, Broadcom BCM2711, quad-core Cortex-A72 (ARM v8) 64-bit SoC @ 1.5GHz, and dual-band 2.4 GHz and 5.0 GHz IEEE 802.11ac wireless.',
    price: 75.00,
    imageUrl: 'https://picsum.photos/400/300?random=2',
    category: 'Single-Board Computers',
    stock: 30,
    rating: 4.9,
    reviews: 95,
    condition: 'New',
  },
  {
    id: 'p103',
    name: 'Assorted Resistor Kit (600 pcs)',
    description: 'A comprehensive kit containing 600 assorted resistors, 1/4W, 1% tolerance. Essential for electronics enthusiasts or professionals. Includes common values from 1 Ohm to 1 MOhm.',
    price: 12.50,
    imageUrl: 'https://picsum.photos/400/300?random=3',
    category: 'General Electronic Components',
    stock: 100,
    rating: 4.5,
    reviews: 200,
    condition: 'New',
  },
  {
    id: 'p104',
    name: 'Electrolytic Capacitor Kit',
    description: 'Variety of electrolytic capacitor values, great for power supplies, audio projects, and general electronic circuit building. High quality and reliable.',
    price: 15.75,
    imageUrl: 'https://picsum.photos/400/300?random=4',
    category: 'General Electronic Components',
    stock: 80,
    rating: 4.6,
    reviews: 150,
    condition: 'New',
  },
  {
    id: 'p105',
    name: 'Breadboard (830 tie points)',
    description: 'Standard breadboard with 830 tie points, perfect for quickly prototyping electronic circuits.',
    price: 5.99,
    imageUrl: 'https://picsum.photos/400/300?random=5',
    category: 'Prototyping',
    stock: 120,
    rating: 4.7,
    reviews: 300,
    condition: 'New',
  },
  {
    id: 'p106',
    name: 'Jumper Wire Kit (Male-Male, Male-Female, Female-Female)',
    description: 'Essential for breadboarding and connecting components. Contains 120 pieces of various lengths and types.',
    price: 8.99,
    imageUrl: 'https://picsum.photos/400/300?random=6',
    category: 'Prototyping',
    stock: 150,
    rating: 4.7,
    reviews: 280,
    condition: 'New',
  },
  {
    id: 'p107',
    name: 'Electronics Soldering Kit (60W)',
    description: 'Complete soldering kit with a 60W iron, stand, solder, and desoldering pump. Great for beginners and hobbyists.',
    price: 35.00,
    imageUrl: 'https://picsum.photos/400/300?random=7',
    category: 'Tools',
    stock: 40,
    rating: 4.6,
    reviews: 180,
    condition: 'New',
  },
  {
    id: 'p108',
    name: 'Digital Multimeter',
    description: 'Accurate and easy-to-use digital multimeter for measuring voltage, current, resistance, continuity, and more. A must-have for electronics work.',
    price: 29.99,
    imageUrl: 'https://picsum.photos/400/300?random=8',
    category: 'Tools',
    stock: 60,
    rating: 4.8,
    reviews: 250,
    condition: 'New',
  },
  {
    id: 'p109',
    name: 'Assorted LED Kit (3mm/5mm)',
    description: 'Kit containing various colors of 3mm and 5mm LEDs. Great for indicator lights and aesthetic projects.',
    price: 7.99,
    imageUrl: 'https://picsum.photos/400/300?random=9',
    category: 'General Electronic Components',
    stock: 200,
    rating: 4.5,
    reviews: 190,
    condition: 'New',
  },
  {
    id: 'p110',
    name: 'Assorted Tactile Button Kit',
    description: 'Kit containing various types of small tactile buttons, perfect for microcontroller user input and interfaces.',
    price: 6.50,
    imageUrl: 'https://picsum.photos/400/300?random=10',
    category: 'General Electronic Components',
    stock: 180,
    rating: 4.4,
    reviews: 110,
    condition: 'New',
  },
  {
    id: 'p111',
    name: 'Intel Core i7-12700K Processor',
    description: 'High-performance 12th Gen Intel Core i7 desktop processor. Features 12 Cores (8 P-core + 4 E-core) and 20 Threads, max turbo frequency of 5.0 GHz. Ideal for gaming, content creation, and intensive applications.',
    price: 329.99,
    imageUrl: 'https://picsum.photos/400/300?random=26',
    category: 'Computer Parts',
    stock: 40,
    rating: 4.9,
    reviews: 210,
    condition: 'New',
  },
  {
    id: 'p112',
    name: 'NVIDIA GeForce RTX 3060 Graphics Card',
    description: 'Powerful graphics card delivering high performance for 1080p and 1440p gaming. Features 12GB GDDR6 VRAM and NVIDIA Ampere architecture.',
    price: 499.00,
    imageUrl: 'https://picsum.photos/400/300?random=27',
    category: 'Computer Parts',
    stock: 25,
    rating: 4.7,
    reviews: 180,
    condition: 'New',
  },
  {
    id: 'p113',
    name: 'ASUS ROG Strix Z690-E Gaming WiFi Motherboard',
    description: 'Premium ATX motherboard for 12th Gen Intel CPUs. Features PCIe 5.0, DDR5 support, Wi-Fi 6E, and robust power delivery for high-end builds.',
    price: 379.99,
    imageUrl: 'https://picsum.photos/400/300?random=28',
    category: 'Computer Parts',
    stock: 30,
    rating: 4.6,
    reviews: 90,
    condition: 'New',
  },
  {
    id: 'p114',
    name: 'Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz RAM',
    description: 'High-performance DDR4 RAM optimized for Intel and AMD systems. Low-profile heat spreader design for smaller cases.',
    price: 69.99,
    imageUrl: 'https://picsum.photos/400/300?random=29',
    category: 'Computer Parts',
    stock: 120,
    rating: 4.8,
    reviews: 300,
    condition: 'New',
  },
  {
    id: 'p115',
    name: 'Samsung 970 EVO Plus 1TB NVMe SSD',
    description: 'Reliable NVMe SSD for fast boot-ups and rapid application loading. Sequential read/write speeds up to 3,500/3,300 MB/s.',
    price: 99.99,
    imageUrl: 'https://picsum.photos/400/300?random=30',
    category: 'Computer Parts',
    stock: 80,
    rating: 4.9,
    reviews: 450,
    condition: 'New',
  },
  {
    id: 'p116',
    name: 'Dell XPS 15 Laptop Battery (Genuine)',
    description: 'Genuine replacement battery for Dell XPS 15 (9500/9510/9520) series laptops. Restore your laptop\'s battery life.',
    price: 119.00,
    imageUrl: 'https://picsum.photos/400/300?random=31',
    category: 'Laptop Parts',
    stock: 20,
    rating: 4.5,
    reviews: 70,
    condition: 'New',
  },
  {
    id: 'p117',
    name: 'HP Spectre x360 Laptop Keyboard Replacement',
    description: 'Backlit replacement keyboard for HP Spectre x360 (13-inch) series laptops. US layout. Easy installation for experienced users.',
    price: 75.00,
    imageUrl: 'https://picsum.photos/400/300?random=32',
    category: 'Laptop Parts',
    stock: 35,
    rating: 4.3,
    reviews: 45,
    condition: 'New',
  },
  {
    id: 'p118',
    name: 'Universal Laptop Charger (90W)',
    description: '90W universal laptop charger with multiple tips compatible with most popular brands (Dell, HP, Lenovo, Acer, Asus). Over-voltage and short-circuit protection.',
    price: 34.99,
    imageUrl: 'https://picsum.photos/400/300?random=33',
    category: 'Laptop Parts',
    stock: 90,
    rating: 4.7,
    reviews: 160,
    condition: 'New',
  },
  {
    id: 'p119',
    name: 'Canon PIXMA Ink Cartridge Set (CMYK)',
    description: 'Full set of genuine Canon PIXMA ink cartridges (Cyan, Magenta, Yellow, Black). Delivers vibrant photos and sharp text output.',
    price: 59.99,
    imageUrl: 'https://picsum.photos/400/300?random=34',
    category: 'Printer Parts',
    stock: 60,
    rating: 4.6,
    reviews: 110,
    condition: 'New',
  },
  {
    id: 'p120',
    name: 'HP LaserJet Toner Cartridge (Black)',
    description: 'Genuine HP LaserJet toner cartridge for monochrome laser printers. Provides consistent, high-quality prints for up to 1,500 pages.',
    price: 89.00,
    imageUrl: 'https://picsum.photos/400/300?random=35',
    category: 'Printer Parts',
    stock: 45,
    rating: 4.8,
    reviews: 95,
    condition: 'New',
  },
  {
    id: 'p121',
    name: 'Epson EcoTank Print Head Assembly',
    description: 'Replacement print head assembly for Epson EcoTank series printers. Restores printing quality and prevents clogging issues.',
    price: 130.00,
    imageUrl: 'https://picsum.photos/400/300?random=36',
    category: 'Printer Parts',
    stock: 10,
    rating: 4.2,
    reviews: 20,
    condition: 'New',
  },
  {
    id: 'p122',
    name: 'Xerox WorkCentre Drum Unit',
    description: 'Genuine Xerox drum unit for WorkCentre multifunction printers. Essential for maintaining image quality and extending printer life.',
    price: 210.00,
    imageUrl: 'https://picsum.photos/400/300?random=37',
    category: 'Photocopy Parts',
    stock: 8,
    rating: 4.4,
    reviews: 15,
    condition: 'New',
  },
  {
    id: 'p123',
    name: 'Canon ImageRUNNER Developer Unit',
    description: 'Replacement developer unit for Canon ImageRUNNER series copiers. Ensures sharp and consistent image development.',
    price: 175.00,
    imageUrl: 'https://picsum.photos/400/300?random=38',
    category: 'Photocopy Parts',
    stock: 12,
    rating: 4.3,
    reviews: 10,
    condition: 'New',
  },
  {
    id: 'p124',
    name: 'SMD Component Sample Book',
    description: 'A sample book containing various SMD resistors and capacitors. Great for prototyping and repair work.',
    price: 28.00,
    imageUrl: 'https://picsum.photos/400/300?random=39',
    category: 'General Electronic Components',
    stock: 70,
    rating: 4.5,
    reviews: 50,
    condition: 'New',
  },
  {
    id: 'p125',
    name: 'Digital Oscilloscope (2-Channel, 100MHz)',
    description: 'Compact and powerful digital oscilloscope for electronic circuit debugging, signal analysis, and educational purposes. Features 2 channels and 100MHz bandwidth.',
    price: 299.00,
    imageUrl: 'https://picsum.photos/400/300?random=40',
    category: 'Tools',
    stock: 15,
    rating: 4.8,
    reviews: 30,
    condition: 'New',
  },
];

const _loadProducts = (): Product[] => {
  const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  if (storedProducts) {
    return JSON.parse(storedProducts);
  }
  _saveProducts(_initialProducts); // Save initial data if not present
  return _initialProducts;
};

const _saveProducts = (productsToSave: Product[]): void => {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productsToSave));
};

_products = _loadProducts(); // Initialize products on load

export const getProducts = (): Product[] => {
  return _products;
};

export const addProduct = (newProduct: Omit<Product, 'id'>): Product => {
  const productWithId = { ...newProduct, id: generateUniqueId('p') };
  _products.push(productWithId);
  _saveProducts(_products); // Persist to local storage
  return productWithId;
};


// --- Course Data (Persistent Mock) ---
const COURSES_STORAGE_KEY = 'mayatech_courses';
let _courses: Course[] = [];

const _initialCourses: Course[] = [
  {
    id: 'c201',
    title: 'Beginner Arduino Programming',
    shortDescription: 'Get started with Arduino! Learn the basics of programming and building electronic circuits with hands-on projects.',
    longDescription: 'This course is designed for absolute beginners with no prior experience in electronics or programming. You will learn how to set up your Arduino board, write your first sketch, control LEDs, read sensor data, and build simple interactive projects. The course includes video lessons, coding challenges, and practical exercises to reinforce your learning.',
    imageUrl: 'https://picsum.photos/400/300?random=11',
    instructor: 'Dr. Emily Tech',
    duration: '4 Months',
    price: 99.99,
    // FIX: Updated difficulty to 'Beginner' to match the Course['difficulty'] type.
    difficulty: 'Beginner',
    modules: [
      {
        title: 'Introduction to Arduino',
        content: `
          <ul>
            <li><strong>Topic 1.1: What is Arduino?</strong>
              <ul>
                <li>Understanding the Arduino platform: hardware (boards like Uno, Nano) and software (IDE).</li>
                <li>Open-source nature and community.</li>
                <li>Applications of Arduino in various fields.</li>
              </ul>
            </li>
            <li><strong>Topic 1.2: Setting up Your Arduino Environment</strong>
              <ul>
                <li>Installing the Arduino IDE on Windows, macOS, and Linux.</li>
                <li>Connecting your Arduino board to your computer.</li>
                <li>Selecting the correct board and port in the IDE.</li>
                <li>Overview of the Arduino IDE interface: Sketch, Verify, Upload buttons.</li>
              </ul>
            </li>
            <li><strong>Topic 1.3: Your First Arduino Program: "Blink"</strong>
              <ul>
                <li>Understanding <code>setup()</code> and <code>loop()</code> functions.</li>
                <li>Introduction to basic functions: <code>pinMode()</code>, <code>digitalWrite()</code>, <code>delay()</code>.</li>
                <li>Uploading and testing the "Blink" example sketch.</li>
                <li>Basic troubleshooting for common setup issues.</li>
              </ul>
            </li>
          </ul>
        `,
      },
      {
        title: 'Basic I/O Operations',
        content: `
          <ul>
            <li><strong>Topic 2.1: Controlling Digital Outputs with LEDs</strong>
              <ul>
                <li>Understanding digital pins and their states (HIGH/LOW).</li>
                <li>Wiring LEDs with current-limiting resistors.</li>
                <li>Writing sketches to turn LEDs on and off, create blinking patterns.</li>
                <li>Introduction to variables and constants for pin assignments.</li>
              </ul>
            </li>
            <li><strong>Topic 2.2: Reading Digital Inputs with Push Buttons</strong>
              <ul>
                <li>Understanding pull-up and pull-down resistors.</li>
                <li>Wiring push buttons for digital input.</li>
                <li>Using <code>digitalRead()</code> to detect button presses.</li>
                <li>Implementing state changes based on button input (e.g., toggle an LED).</li>
                <li>Introduction to debouncing techniques for stable button readings.</li>
              </ul>
            </li>
          </ul>
        `,
      },
      {
        title: 'Analog Inputs',
        content: `
          <ul>
            <li><strong>Topic 3.1: Understanding Analog Signals and ADC</strong>
              <ul>
                <li>Difference between digital and analog signals.</li>
                <li>Introduction to Arduino's Analog-to-Digital Converter (ADC).</li>
                <li>Understanding the <code>analogRead()</code> function and its output range (0-1023).</li>
              </ul>
            </li>
            <li><strong>Topic 3.2: Reading Variable Inputs: Potentiometers</strong>
              <ul>
                <li>Wiring a potentiometer to an analog pin.</li>
                <li>Mapping analog values to desired ranges using the <code>map()</code> function.</li>
                <li>Controlling an LED's brightness (PWM) or other parameters with a potentiometer.</li>
              </ul>
            </li>
            <li><strong>Topic 3.3: Light Sensors (Photoresistors/LDRs)</strong>
              <ul>
                <li>Using photoresistors in a voltage divider circuit.</li>
                <li>Reading light intensity values and responding to changes.</li>
                <li>Building a simple light-activated switch.</li>
              </ul>
            </li>
          </ul>
        `,
      },
      {
        title: 'Serial Communication',
        content: `
          <ul>
            <li><strong>Topic 4.1: Debugging with the Serial Monitor</strong>
              <ul>
                <li>Introduction to serial communication for debugging and data transfer.</li>
                <li>Using <code>Serial.begin()</code> to initialize serial communication.</li>
                <li>Sending data from Arduino to the computer using <code>Serial.print()</code> and <code>Serial.println()</code>.</li>
                <li>Monitoring sensor readings and variable states in the Serial Monitor.</li>
              </ul>
            </li>
            <li><strong>Topic 4.2: Data Exchange (Basic) - Controlling Arduino from Computer</strong>
              <ul>
                <li>Reading data sent from the Serial Monitor to Arduino using <code>Serial.available()</code> and <code>Serial.read()</code>.</li>
                <li>Implementing simple commands to control Arduino components (e.g., turning an LED on/off by typing commands).</li>
              </ul>
            </li>
          </ul>
        `,
      },
      {
        title: 'First Project: Traffic Light System',
        content: `
          <ul>
            <li><strong>Topic 5.1: Project Planning and Design</strong>
              <ul>
                <li>Defining project requirements: Traffic light sequence (Green, Yellow, Red, Red+Yellow).</li>
                <li>Component selection: LEDs, resistors.</li>
                <li>Drawing a simple circuit schematic and wiring diagram.</li>
                <li>Breaking down the problem into smaller, manageable steps.</li>
              </ul>
            </li>
            <li><strong>Topic 5.2: Implementation and Code Structure</strong>
              <ul>
                <li>Writing a structured Arduino sketch using functions for each light state.</li>
                <li>Integrating <code>delay()</code> for timing the light changes.</li>
                <li>Testing each stage of the traffic light sequence.</li>
              </ul>
            </li>
            <li><strong>Topic 5.3: Refinement and Advanced Concepts (Optional)</strong>
              <ul>
                <li>Adding a pedestrian button for a crosswalk signal.</li>
                <li>Exploring more robust timing mechanisms (e.g., using <code>millis()</code> instead of <code>delay()</code>).</li>
                <li>Debugging and troubleshooting the complete system.</li>
              </ul>
            </li>
          </ul>
        `,
      },
    ],
    learningSchedule: [
      'Week 1-2: Module 1 (Introduction to Arduino)',
      'Week 3-5: Module 2 (Basic I/O Operations)',
      'Week 6-8: Module 3 (Analog Inputs)',
      'Week 9-10: Module 4 (Serial Communication)',
      'Week 11-13: Module 5 (First Project: Traffic Light System)',
      'Week 14-16: Buffer/Review',
    ],
  },
  {
    id: 'c202',
    title: 'Advanced Raspberry Pi Projects',
    shortDescription: 'Dive into advanced Raspberry Pi projects, including home automation, IoT, and custom server setups.',
    longDescription: 'For those who have a basic understanding of Raspberry Pi, this course will take you to the next level. Explore topics such as setting up a web server, implementing IoT solutions, Computer Vision with Pi Camera, and building a Network Attached Storage (NAS) system. Prior basic knowledge of Linux command line and some Python programming experience is recommended.',
    imageUrl: 'https://picsum.photos/400/300?random=12',
    instructor: 'Prof. Alex Gadget',
    duration: '6 Months',
    // FIX: Updated difficulty to 'Advanced' to match the Course['difficulty'] type.
    price: 149.99,
    difficulty: 'Advanced',
    modules: [
      {
        title: 'Linux Deep Dive',
        content: `
          <ul>
            <li><strong>Topic 1.1: Advanced Command Line Interface (CLI)</strong>
              <ul>
                <li>Review of essential Linux commands (<code>ls</code>, <code>cd</code>, <code>cp</code>, <code>mv</code>, <code>rm</code>, <code>mkdir</code>).</li>
                <li>Working with file permissions (<code>chmod</code>, <code>chown</code>).</li>
                <li>Process management (<code>ps</code>, <code>top</code>, <code>kill</code>).</li>
                <li>Piping (<code>|</code>), redirection (<code>></code>, <code>>></code>), and background processes (<code>&</code>, <code>nohup</code>).</li>
                <li>Text processing with <code>grep</code>, <code>awk</code>, <code>sed</code>.</li>
                <li>Finding files with <code>find</code>.</li>
                <li>Archiving and compression (<code>tar</code>, <code>gzip</code>, <code>zip</code>).</li>
              </ul>
            </li>
            <li><strong>Topic 1.2: Shell Scripting with Bash</strong>
              <ul>
                <li>Introduction to Bash scripting: <code>#!/bin/bash</code>.</li>
                <li>Variables, arithmetic operations, command substitution.</li>
                <li>Conditional statements (<code>if/else</code>, <code>case</code>).</li>
                <li>Loops (<code>for</code>, <code>while</code>).</li>
                <li>Functions.</li>
                <li>User input and command-line arguments.</li>
                <li>Automating tasks with scripts (e.g., backups, system monitoring).</li>
                <li>Scheduling tasks with Cron jobs.</li>
              </ul>
            </li>
          </ul>
        `,
      },
      {
        title: 'Web Server Setup',
        content: `
          <ul>
            <li><strong>Topic 2.1: Apache/Nginx Installation & Configuration</strong>
              <ul>
                <li>Introduction to web servers and their role.</li>
                <li>Installing Apache2 or Nginx on Raspberry Pi.</li>
                <li>Basic configuration: document root, virtual hosts.</li>
                <li>Setting up firewall rules (<code>ufw</code>).</li>
                <li>Testing server functionality from a web browser.</li>
              </ul>
            </li>
            <li><strong>Topic 2.2: Dynamic Content with PHP/Python</strong>
              <ul>
                <li>Integrating PHP with Apache (mod_php) or Nginx (php-fpm).</li>
                <li>Creating simple dynamic web pages with PHP.</li>
                <li>Introduction to Python web frameworks (Flask/Django micro-overview).</li>
                <li>Deploying a Python web application (e.g., Flask) with WSGI servers (Gunicorn/uWSGI).</li>
                <li>Using Nginx as a reverse proxy for Python applications.</li>
              </ul>
            </li>
          </ul>
        `,
      },
      {
        title: 'IoT with Node-RED',
        content: `
          <ul>
            <li><strong>Topic 3.1: Introduction to Node-RED</strong>
              <ul>
                <li>Visual programming for the Internet of Things (IoT).</li>
                <li>Understanding nodes, flows, messages, and dashboard.</li>
                <li>Installation and setup of Node-RED on Raspberry Pi.</li>
                <li>Accessing the Node-RED editor in a browser.</li>
              </ul>
            </li>
            <li><strong>Topic 3.2: Connecting Sensors and Actuators</strong>
              <ul>
                <li>Using Raspberry Pi GPIO nodes for digital and analog I/O.</li>
                <li>Interacting with MQTT brokers for message passing between devices.</li>
                <li>Using HTTP nodes to interact with web APIs and external services.</li>
                <li>Building practical flows:
                  <ul>
                    <li>Temperature/humidity sensor data to dashboard.</li>
                    <li>Button-controlled LED via MQTT.</li>
                    <li>Integrating with online services (e.g., weather APIs).</li>
                  </ul>
                </li>
                <li>Installing and using custom Node-RED nodes.</li>
              </ul>
            </li>
          </ul>
        `,
      },
      {
        title: 'Computer Vision Basics',
        content: `
          <ul>
            <li><strong>Topic 4.1: OpenCV with Raspberry Pi Setup</strong>
              <ul>
                <li>Introduction to Computer Vision concepts.</li>
                <li>Installing OpenCV library for Python on Raspberry Pi.</li>
                <li>Connecting and testing the Raspberry Pi Camera Module.</li>
                <li>Basic image capture, display, and saving.</li>
                <li>Understanding image formats and pixel manipulation.</li>
              </ul>
            </li>
            <li><strong>Topic 4.2: Simple Computer Vision Applications</strong>
              <ul>
                <li>Image processing fundamentals: grayscale conversion, blurring, thresholding.</li>
                <li>Edge detection using Canny algorithm.</li>
                <li>Contour detection: finding and drawing shapes.</li>
                <li>Basic object tracking (e.g., color-based tracking).</li>
                <li>Introduction to face detection using Haar Cascades.</li>
                <li>Real-time video processing from the camera feed.</li>
              </ul>
            </li>
          </ul>
        `,
      },
      {
        title: 'Building a NAS (Network Attached Storage)',
        content: `
          <ul>
            <li><strong>Topic 5.1: Storage and File Sharing Solutions</strong>
              <ul>
                <li>Introduction to Network Attached Storage (NAS) principles.</li>
                <li>Connecting external USB hard drives to Raspberry Pi.</li>
                <li>File systems: ext4, NTFS, and mounting options.</li>
                <li>Setting up Samba (SMB/CIFS) for Windows file sharing.</li>
                <li>Configuring NFS for Linux/Unix file sharing.</li>
                <li>User and group permissions for shared folders.</li>
              </ul>
            </li>
            <li><strong>Topic 5.2: Advanced NAS Features</strong>
              <ul>
                <li>Accessing NAS securely with SSH.</li>
                <li>Setting up an FTP server (e.g., vsftpd).</li>
                <li>Introduction to web-based file managers (e.g., FileBrowser, lightweight self-hosted cloud solutions).</li>
                <li>Basic backup strategies with <code>rsync</code>.</li>
                <li>(Optional) Overview of software RAID for data redundancy (conceptually, not practical for single Pi with USB drives for production).</li>
              </ul>
            </li>
          </ul>
        `,
      },
    ],
    learningSchedule: [
      'Month 1: Module 1 (Linux Deep Dive)',
      'Month 2: Module 2 (Web Server Setup)',
      'Month 3: Module 3 (IoT with Node-RED)',
      'Month 4: Module 4 (Computer Vision Basics)',
      'Month 5: Module 5 (Building a NAS)',
      'Month 6: Buffer/Review (Capstone Project)',
    ],
  },
  {
    id: 'c203',
    title: 'Electronics Repair Fundamentals',
    shortDescription: 'Learn essential techniques to diagnose and repair common electronic devices.',
    longDescription: 'This intermediate course covers fundamental electronics repair techniques, including safe soldering/desoldering, component identification, reading schematics, and systematic troubleshooting. You\'ll work on common electronic devices and components. Ideal for hobbyists and aspiring technicians.',
    imageUrl: 'https://picsum.photos/400/300?random=13',
    instructor: 'Engineer Sarah Fixit',
    duration: '8 Months',
    // FIX: Updated difficulty to 'Intermediate' to match the Course['difficulty'] type.
    price: 199.99,
    difficulty: 'Intermediate',
    modules: [
      {
        title: 'Safety and Workshop Setup',
        content: `
          <ul>
            <li><strong>Topic 1.1: Electrostatic Discharge (ESD) Precautions</strong>
              <ul>
                <li>Understanding ESD: what it is and how it damages components.</li>
                <li>ESD safe practices: wrist straps, mats, grounding.</li>
                <li>Proper handling and storage of sensitive electronics.</li>
              </ul>
            </li>
            <li><strong>Topic 1.2: Essential Tools for Electronics Repair</strong>
              <ul>
                <li><strong>Measurement:</strong> Digital Multimeter (DMM) - voltage, current, resistance, continuity, diode test. (Optional: Oscilloscope introduction).</li>
                <li><strong>Soldering:</strong> Soldering iron (types, tips), solder (leaded vs. lead-free), desoldering pump, desoldering braid.</li>
                <li><strong>Hand Tools:</strong> Screwdrivers, pliers, wire cutters, tweezers, strippers, magnifying lamp.</li>
                <li><strong>Power:</strong> Bench power supply.</li>
              </ul>
            </li>
            <li><strong>Topic 1.3: Workplace Safety</strong>
              <ul>
                <li>Fume extraction for soldering.</li>
                <li>Safety glasses and gloves.</li>
                <li>Fire safety (extinguisher).</li>
                <li>Proper ventilation.</li>
              </ul>
            </li>
          </ul>
        `,
      },
      {
        title: 'Component Identification & Testing',
        content: `
          <ul>
            <li><strong>Topic 2.1: Passive Components</strong>
              <ul>
                <li><strong>Resistors:</strong> Color codes, SMD markings, types (carbon film, metal film), power ratings. Testing resistance with DMM.</li>
                <li><strong>Capacitors:</strong> Polarized vs. non-polarized, electrolytic, ceramic, tantalum. Reading values. Visual inspection for damage. Basic testing (continuity, ESR meter concept).</li>
                <li><strong>Inductors:</strong> Coil structure, basic types. Visual inspection.</li>
              </ul>
            </li>
            <li><strong>Topic 2.2: Active Components</strong>
              <ul>
                <li><strong>Diodes:</strong> PN junction, rectifier, Zener, LED. Testing with DMM diode test mode.</li>
                <li><strong>Transistors:</strong> BJT (NPN/PNP), MOSFET. Pinouts (EBC/GDS). Basic testing for shorts/opens with DMM.</li>
                <li><strong>Integrated Circuits (ICs):</strong> Packaging (DIP, SMD), identification numbers. Deciphering datasheets. General purpose vs. specialized ICs.</li>
              </ul>
            </li>
          </ul>
        `,
      },
      {
        title: 'Soldering and Desoldering',
        content: `
          <ul>
            <li><strong>Topic 3.1: Through-Hole Component Techniques</strong>
              <ul>
                <li>Proper soldering temperature and tip selection.</li>
                <li>Tinning the iron tip.</li>
                <li>Achieving good solder joints: "wetting" and "fillet" formation.</li>
                <li>Desoldering through-hole components using a pump and braid.</li>
                <li>Cleaning techniques (IPA).</li>
              </ul>
            </li>
            <li><strong>Topic 3.2: Surface Mount Device (SMD) Techniques (Beginner)</strong>
              <ul>
                <li>Introduction to SMD components and their advantages.</li>
                <li>Tools for SMD: fine-tip soldering iron, hot air rework station (overview), fine tweezers.</li>
                <li>Basic SMD soldering (drag soldering for simple ICs, one-pad-at-a-time for resistors/capacitors).</li>
                <li>Basic SMD desoldering with hot air or specialized iron tips.</li>
                <li>Challenges and best practices for SMD rework.</li>
              </ul>
            </li>
          </ul>
        `,
      },
      {
        title: 'Basic Circuit Analysis',
        content: `
          <ul>
            <li><strong>Topic 4.1: Ohm's Law and Power</strong>
              <ul>
                <li>Understanding Voltage, Current, and Resistance.</li>
                <li>Applying Ohm's Law (V=IR) to calculate unknown values.</li>
                <li>Calculating power (P=VI, P=I&sup2;R, P=V&sup2;/R).</li>
                <li>Series and parallel resistor combinations.</li>
              </ul>
            </li>
            <li><strong>Topic 4.2: Kirchhoff's Laws</strong>
              <ul>
                <li>Kirchhoff's Current Law (KCL): Current conservation at a node.</li>
                <li>Kirchhoff's Voltage Law (KVL): Voltage drops around a loop.</li>
                <li>Applying KCL and KVL to analyze simple circuits.</li>
                <li>Voltage dividers and current limiting for LEDs.</li>
              </ul>
            </li>
          </ul>
        `,
      },
      {
        title: 'Troubleshooting Methodologies',
        content: `
          <ul>
            <li><strong>Topic 5.1: Systematic Fault Finding Approach</strong>
              <ul>
                <li><strong>Visual Inspection:</strong> Burnt components, swollen capacitors, cold solder joints, broken traces, corrosion.</li>
                <li><strong>Divide and Conquer:</strong> Isolating the problem area (e.g., power section vs. logic section).</li>
                <li><strong>Signal Tracing:</strong> Following signal paths (conceptually, with DMM, or basic oscilloscope use).</li>
                <li><strong>Voltage Measurement:</strong> Checking supply rails, voltage drops across components.</li>
                <li><strong>Continuity Testing:</strong> Checking for opens and shorts.</li>
                <li>Component-level testing (in-circuit vs. out-of-circuit).</li>
              </ul>
            </li>
            <li><strong>Topic 5.2: Common Failure Modes</strong>
              <ul>
                <li>Capacitor failure (bulging, leakage, high ESR).</li>
                <li>Diode and rectifier failure.</li>
                <li>Overheating issues in ICs and power transistors.</li>
                <li>Intermittent connections (cold joints, loose connectors).</li>
                <li>Blown fuses.</li>
              </ul>
            </li>
          </ul>
        `,
      },
      {
        title: 'Common Repairs',
        content: `
          <ul>
            <li><strong>Topic 6.1: Power Supply Unit (PSU) Repair</strong>
              <ul>
                <li>Types of PSUs (linear, switching).</li>
                <li>Identifying common PSU components and their functions.</li>
                <li>Troubleshooting "dead" PSUs: checking fuses, rectifiers, capacitors, voltage regulators.</li>
                <li>Component replacement in PSUs.</li>
              </ul>
            </li>
            <li><strong>Topic 6.2: Repair of Simple Boards</strong>
              <ul>
                <li>Case studies: USB chargers, LED driver boards, small appliance control boards.</li>
                <li>Disassembly and reassembly techniques.</li>
                <li>Diagnosing and replacing common components (e.g., replacing a micro-USB port, repairing a broken trace).</li>
                <li>Importance of schematics and service manuals (when available).</li>
                <li>Final testing and safety checks.</li>
              </ul>
            </li>
          </ul>
        `,
      },
    ],
    learningSchedule: [
      'Month 1: Module 1 (Safety and Workshop Setup)',
      'Month 2 - Mid Month 3: Module 2 (Component Identification & Testing)',
      'Mid Month 3 - End Month 4: Module 3 (Soldering and Desoldering)',
      'Month 5: Module 4 (Basic Circuit Analysis)',
      'Month 6 - Mid Month 7: Module 5 (Troubleshooting Methodologies)',
      'Mid Month 7 - End Month 8: Module 6 (Common Repairs)',
    ],
  },
  {
    id: 'c204',
    title: 'Introduction to PCB Design',
    shortDescription: 'Learn the fundamentals of designing custom Printed Circuit Boards (PCBs) using free software.',
    longDescription: 'This course introduces you to the basics of PCB design. You\'ll learn how to transform a circuit schematic into a physical circuit board layout, select components, route traces, and prepare manufacturing files using KiCad. No prior PCB design experience is required.',
    imageUrl: 'https://picsum.photos/400/300?random=14',
    instructor: 'Mr. Circuit Board',
    duration: '5 Months',
    // FIX: Updated difficulty to 'Beginner' to match the Course['difficulty'] type.
    price: 129.99,
    difficulty: 'Beginner',
    modules: [
      {
        title: 'Introduction to KiCad',
        content: `
          <ul>
            <li><strong>Topic 1.1: What is KiCad?</strong>
              <ul>
                <li>Overview of KiCad: an open-source EDA suite for schematic capture and PCB layout.</li>
                <li>Components of KiCad: Project Manager, Schematic Editor (Eeschema), PCB Layout Editor (Pcbnew), Footprint Editor, Symbol Editor, Gerber Viewer.</li>
              </ul>
            </li>
            <li><strong>Topic 1.2: KiCad Installation and Project Setup</strong>
              <ul>
                <li>Installing KiCad on various operating systems.</li>
                <li>Creating a new KiCad project (<code>.pro</code> file).</li>
                <li>Understanding the project file structure and manager.</li>
              </ul>
            </li>
            <li><strong>Topic 1.3: Basic KiCad Workflow</strong>
              <ul>
                <li>The PCB design flow: Idea -> Schematic -> Layout -> Manufacturing.</li>
                <li>Introduction to symbol and footprint libraries.</li>
              </ul>
            </li>
          </ul>
        `,
      },
      {
        title: 'Schematic Capture',
        content: `
          <ul>
            <li><strong>Topic 2.1: Drawing Your Circuit with Eeschema</strong>
              <ul>
                <li>Opening Eeschema (Schematic Editor).</li>
                <li>Adding components (symbols) from KiCad's libraries.</li>
                <li>Wiring components using nets and labels.</li>
                <li>Adding power and ground symbols.</li>
                <li>Using local and global labels, buses.</li>
              </ul>
            </li>
            <li><strong>Topic 2.2: Component Properties and Annotations</strong>
              <ul>
                <li>Editing symbol properties: Reference designator, value, footprint link (initial setup).</li>
                <li>Annotating components automatically and manually.</li>
                <li>Generating a Bill of Materials (BOM) from the schematic.</li>
                <li>Introduction to hierarchical schematics for complex designs.</li>
              </ul>
            </li>
            <li><strong>Topic 2.3: Electrical Rules Check (ERC)</strong>
              <ul>
                <li>Running ERC to identify common schematic errors (unconnected pins, power flags, conflicts).</li>
                <li>Interpreting and resolving ERC warnings and errors.</li>
              </ul>
            </li>
          </ul>
        `,
      },
      {
        title: 'Footprint Selection & Creation',
        content: `
          <ul>
            <li><strong>Topic 3.1: Assigning Physical Footprints</strong>
              <ul>
                <li>Understanding footprints: the physical representation of a component on the PCB.</li>
                <li>Opening CvPcb (Footprint Assignment Tool) or assigning footprints directly in Eeschema.</li>
                <li>Selecting appropriate footprints from KiCad's extensive libraries.</li>
                <li>Importance of component datasheets for correct footprint choice.</li>
              </ul>
            </li>
            <li><strong>Topic 3.2: Custom Footprint Creation (Basic)</strong>
              <ul>
                <li>When and why to create custom footprints.</li>
                <li>Using the Footprint Editor: creating pads, silkscreen graphics (component outlines, polarity indicators), 3D model assignments (basic).</li>
                <li>Saving custom footprints to personal libraries.</li>
                <li>Verifying custom footprints against datasheets.</li>
              </ul>
            </li>
          </ul>
        `,
      },
      {
        title: 'Board Layout',
        content: `
          <ul>
            <li><strong>Topic 4.1: Initial Board Setup in Pcbnew</strong>
              <ul>
                <li>Opening Pcbnew (PCB Layout Editor).</li>
                <li>Importing the netlist from the schematic.</li>
                <li>Defining the board outline (edge cuts layer).</li>
                <li>Layer management in KiCad (F.Cu, B.Cu, F.Silkscreen, B.Silkscreen, etc.).</li>
              </ul>
            </li>
            <li><strong>Topic 4.2: Component Placement Strategies</strong>
              <ul>
                <li>Optimal component placement for performance, aesthetics, and manufacturability.</li>
                <li>Grouping related components, minimizing trace lengths.</li>
                <li>Placement of power components, connectors, and mounting holes.</li>
              </ul>
            </li>
            <li><strong>Topic 4.3: Routing Traces and Vias</strong>
              <ul>
                <li>Drawing traces manually.</li>
                <li>Understanding trace widths and clearances for different signals.</li>
                <li>Using vias to switch layers.</li>
                <li>Introduction to design rules (min trace width, min clearance, annular ring).</li>
              </ul>
            </li>
            <li><strong>Topic 4.4: Ground Planes and Design Rules Check (DRC)</strong>
              <ul>
                <li>Creating copper pours (filled zones) for ground planes and power planes.</li>
                <li>Benefits of ground planes: noise reduction, thermal management.</li>
                <li>Setting up and running Design Rules Check (DRC) to identify layout errors.</li>
                <li>Interpreting and resolving DRC errors.</li>
                <li>Adding silkscreen text, logos, and fiducials.</li>
              </ul>
            </li>
          </ul>
        `,
      },
      {
        title: 'Gerber File Generation',
        content: `
          <ul>
            <li><strong>Topic 5.1: Preparing for Manufacturing</strong>
              <ul>
                <li>Understanding Gerber files (<code>.gbr</code>): the standard format for PCB fabrication.</li>
                <li>Outputting all necessary layers: top/bottom copper, silkscreen, solder mask, paste mask, board outline.</li>
                <li>Generating drill files (Excellon format).</li>
                <li>Configuring plot settings in KiCad.</li>
              </ul>
            </li>
            <li><strong>Topic 5.2: Review and Verification</strong>
              <ul>
                <li>Using GerbView (KiCad's Gerber viewer) to inspect generated files.</li>
                <li>Verifying layer alignment, clearances, and overall design integrity.</li>
                <li>Identifying potential manufacturing issues before sending to a fabricator.</li>
                <li>Packaging PCB fabrication files for a manufacturer.</li>
              </ul>
            </li>
          </ul>
        `,
      },
    ],
    learningSchedule: [
      'Week 1-4: Module 1 (Introduction to KiCad)',
      'Week 5-8: Module 2 (Schematic Capture)',
      'Week 9-12: Module 3 (Footprint Selection & Creation)',
      'Week 13-18: Module 4 (Board Layout)',
      'Week 19-20: Module 5 (Gerber File Generation)',
    ],
  },
];

const _loadCourses = (): Course[] => {
  const storedCourses = localStorage.getItem(COURSES_STORAGE_KEY);
  if (storedCourses) {
    return JSON.parse(storedCourses);
  }
  _saveCourses(_initialCourses); // Save initial data if not present
  return _initialCourses;
};

const _saveCourses = (coursesToSave: Course[]): void => {
  localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(coursesToSave));
};

_courses = _loadCourses(); // Initialize courses on load

export const getCourses = (): Course[] => {
  return _courses;
};

export const addCourse = (newCourse: Omit<Course, 'id'>): Course => {
  const courseWithId = { ...newCourse, id: generateUniqueId('c') };
  _courses.push(courseWithId);
  _saveCourses(_courses); // Persist to local storage
  return courseWithId;
};