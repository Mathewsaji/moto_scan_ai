# MotoScan AI 🚗🔍

**Automated Car Damage Assessment & Cost Estimation System**

MotoScan AI is a cross-platform mobile application designed to simplify the evaluation of automobile damage. Leveraging the power of Computer Vision and Machine Learning, the app allows users to capture images of vehicle damage, automatically detect the severity (Buff, Repaint, Replace), and generate instant repair cost estimates.

---

## 📖 Table of Contents
- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [Screenshots](#screenshots)
- [Team](#team)
- [License](#license)

---

## 🧐 About the Project

In countries with high vehicle density, manual damage assessment is often subjective, time-consuming, and prone to human error. MotoScan AI democratizes this process.

By utilizing a **YOLOv8** model trained on a custom dataset and a **React Native** frontend, MotoScan AI provides:
1.  **Instant Analysis:** No need to wait for a mechanic.
2.  **Transparency:** Objective classification of damage severity.
3.  **Cost Estimation:** Logic-based pricing derived from damage extent and car model.

This project was developed as a Specialization Project for the MCA curriculum at CHRIST (Deemed to be University).

---

## 🌟 Key Features

* **📸 Image Capture & Upload:** Seamless integration with device camera and gallery.
* **🤖 Automated Damage Detection:** Identifies dents, scratches, and broken parts using YOLOv8 via Roboflow API.
* **📏 Severity Classification:** Categorizes damage into `Buff`, `Repaint`, or `Replace`.
* **💰 Real-time Cost Estimation:** Maps damage severity and car model to estimated repair costs.
* **🚗 Car Model Identification:** On-device recognition using TensorFlow.js.
* **📱 Cross-Platform:** Optimized for both Android and iOS.

---

## 🛠 Tech Stack

### Frontend
* **Framework:** React Native (JavaScript/TypeScript)
* **ML Integration:** TensorFlow.js (`tfjs-react-native`)
* **State Management:** React Hooks / Context API

### Backend & Services
* **Database & Auth:** Firebase (Firestore, Authentication)
* **ML API:** Roboflow (Hosting YOLOv8 model)
* **Server Logic:** Python (FastAPI - for auxiliary logic)

### Machine Learning
* **Object Detection:** YOLOv8
* **Model Training:** Python, PyTorch, OpenCV
* **Dataset:** Custom dataset (cleaned and annotated via Roboflow)

---

## 🏗 System Architecture

The system follows a 2-tier client-server architecture:
1.  **Client:** The React Native app handles user interaction, image capture, and on-device model identification.
2.  **Server/Cloud:** Roboflow API processes the image for damage coordinates; Firebase handles user data and pricing logic.
![System Architecture](https://github.com/user-attachments/assets/16ab7f53-800f-4e15-99c5-a3468144adb9)



---

## 🚀 Getting Started

### Prerequisites
* Node.js (v14 or later)
* Java Development Kit (JDK)
* Android Studio / Xcode
* Roboflow API Key
* Firebase Project Credentials

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/Mathewsaji/moto_scan_ai.git](https://github.com/Mathewsaji/moto_scan_ai.git)
    cd moto_scan_ai
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment**
    * Create a `.env` file in the root directory.
    * Add your API Keys:
        ```env
        ROBOFLOW_API_KEY=your_key_here
        FIREBASE_API_KEY=your_key_here
        ```

4.  **Run the Application**
    * **Android:**
        ```bash
        npx react-native run-android
        ```
    * **iOS:**
        ```bash
        cd ios && pod install && cd ..
        npx react-native run-ios
        ```

---

## 📱 Screenshots
<img width="279" height="620" alt="Screenshot from 2025-12-15 02-53-00" src="https://github.com/user-attachments/assets/8df6a82e-a7fd-46cd-b185-1e72cd2ff1ea" /> 

<img width="560" height="413" alt="Screenshot from 2025-12-15 02-55-09" src="https://github.com/user-attachments/assets/25609f4c-fea4-4b1c-b829-7e0d03945f7f" />


---

## 👥 Team

**Project Guide:** Dr. Nisha Varghese  
**Department of Computer Science, CHRIST (Deemed to be University)**

* **Mathew Saji** - [GitHub](https://github.com/Mathewsaji)
* **Pranab Rai** - [GitHub](https://github.com/PRANABraight)
* **Samuel Alex Koshy** - [GitHub](https://github.com/TheParadox543)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
