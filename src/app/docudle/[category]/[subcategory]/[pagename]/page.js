import MainView from '../../../mainview';
import docudleData from '../../../../data/pythonDocs.json';

export default function DocudlePage({ params }) {
  const { category, subcategory, pagename } = params;
  
  // Find the current page data
  const categoryData = docudleData.categories.find(
    cat => cat.name === decodeURIComponent(category)
  );
  
  const subcategoryData = categoryData?.subcategories.find(
    sub => sub.name === decodeURIComponent(subcategory)
  );
  
  const pageData = subcategoryData?.pages.find(
    page => page.name === decodeURIComponent(pagename)
  );

  return <MainView 
  currentPage={pageData} 
  isHome={false}
  categoryName={category}
  subcategoryName={subcategory}
  pageName={pagename}
/>
}