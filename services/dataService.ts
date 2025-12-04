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

  const role = email === 'admin@mayatech.com' && password === 'admin' ? 'admin' : 'user';
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
      { title: 'Introduction to Arduino', content: 'What is Arduino? Setting up your environment.' },
      { title: 'Basic I/O Operations', content: 'Controlling LEDs, reading push buttons.' },
      { title: 'Analog Inputs', content: 'Reading potentiometers, light sensors.' },
      { title: 'Serial Communication', content: 'Debugging and data exchange.' },
      { title: 'First Project: Traffic Light', content: 'Applying learned concepts in a project.' },
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
    price: 149.99,
    // FIX: Updated difficulty to 'Advanced' to match the Course['difficulty'] type.
    difficulty: 'Advanced',
    modules: [
      { title: 'Linux Deep Dive', content: 'Advanced command line, scripting with Bash.' },
      { title: 'Web Server Setup', content: 'Apache/Nginx installation & configuration, PHP/Python integration.' },
      { title: 'IoT with Node-RED', content: 'Connecting sensors and actuators, building flows.' },
      { title: 'Computer Vision Basics', content: 'OpenCV with Raspberry Pi, simple applications.' },
      { title: 'Building a NAS', content: 'Storage and file sharing solutions, advanced features.' },
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
    price: 199.99,
    // FIX: Updated difficulty to 'Intermediate' to match the Course['difficulty'] type.
    difficulty: 'Intermediate',
    modules: [
      { title: 'Safety and Workshop Setup', content: 'ESD precautions, essential tools.' },
      { title: 'Component Identification & Testing', content: 'Resistors, capacitors, diodes, transistors, ICs.' },
      { title: 'Soldering and Desoldering', content: 'Through-hole and SMD techniques.' },
      { title: 'Basic Circuit Analysis', content: 'Ohm\'s Law, Kirchhoff\'s Laws, power.' },
      { title: 'Troubleshooting Methodologies', content: 'Systematic fault finding, common failure modes.' },
      { title: 'Common Repairs', content: 'Power supplies, simple boards (e.g., USB chargers, LED drivers).' },
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
    price: 129.99,
    // FIX: Updated difficulty to 'Beginner' to match the Course['difficulty'] type.
    difficulty: 'Beginner',
    modules: [
      { title: 'Introduction to KiCad', content: 'Software overview and setup.' },
      { title: 'Schematic Capture', content: 'Drawing circuits, component properties.' },
      { title: 'Footprint Selection', content: 'Mapping components to physical layouts, custom footprints.' },
      { title: 'Board Layout', content: 'Placing components, routing traces, design rules.' },
      { title: 'Gerber File Generation', content: 'Preparing for manufacturing, review and verification.' },
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