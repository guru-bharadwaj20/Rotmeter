function Footer() {
    return (
      <footer className="bg-gray-900 text-white p-4 fixed w-full bottom-0">
        <div className="container mx-auto text-center">
          &copy; {new Date().getFullYear()} Brainrot. All Skibidi reserved.
        </div>
      </footer>
    );
  }
  
  export default Footer;