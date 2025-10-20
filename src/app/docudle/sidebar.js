import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ data }) {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedSubcategories, setExpandedSubcategories] = useState({});
  const pathname = usePathname();

  const capitalizeWords = (str) => {
    return str.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const toggleSubcategory = (subcategoryName) => {
    setExpandedSubcategories(prev => ({
      ...prev,
      [subcategoryName]: !prev[subcategoryName]
    }));
  };

  return (
    <div className="w-56 border-r border-white h-screen overflow-y-auto">
      {/* What's This? - Home Link */}
      <Link href="/docudle">
        <div className="border-b border-white p-4 text-center text-white hover:bg-gray-900 cursor-pointer">
          Whats This?
        </div>
      </Link>

      {/* Stats */}
      <div className="border-b border-white p-4 text-center text-white hover:bg-gray-900 cursor-pointer">
        Stats
      </div>

      {/* Categories */}
      {data.categories.map((category, catIndex) => (
        <div key={catIndex}>
          {/* Category Header */}
          <div
            onClick={() => toggleCategory(category.name)}
            className="border-b border-white p-4 text-white hover:bg-gray-900 cursor-pointer flex items-center"
          >
            <span className="mr-2">{expandedCategories[category.name] ? '▼︎' : '▶︎'}</span>
            {capitalizeWords(category.name)}
          </div>

          {/* Subcategories */}
          {expandedCategories[category.name] && category.subcategories.map((subcategory, subIndex) => (
            <div key={subIndex}>
              {/* Subcategory Header */}
              <div
                onClick={() => toggleSubcategory(subcategory.name)}
                className="border-b border-l-8 border-white p-4 pl-8 text-white hover:bg-gray-900 cursor-pointer flex items-center"
              >
                <span className="mr-2">{expandedSubcategories[subcategory.name] ? '▼︎' : '▶︎'}</span>
                {capitalizeWords(subcategory.name)}
              </div>

              {/* Pages/Titles */}
              {expandedSubcategories[subcategory.name] && subcategory.pages.map((page, pageIndex) => {
                const pageUrl = `/docudle/${encodeURIComponent(category.name)}/${encodeURIComponent(subcategory.name)}/${encodeURIComponent(page.name)}`;
                const isActive = pathname === pageUrl;
                
                return (
                  <Link key={pageIndex} href={pageUrl}>
                    <div className={`border-b border-l-[16px] border-white p-4 pl-20 text-white hover:bg-gray-900 cursor-pointer ${isActive ? 'bg-gray-800' : ''}`}>
                      {capitalizeWords(page.name)}
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}