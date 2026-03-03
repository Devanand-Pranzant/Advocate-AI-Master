// import React from 'react';
// import { LayoutDashboard, Grid3x3, Monitor, Smartphone, Tablet, Columns, Square, Circle, Triangle, ChevronRight, Eye, Code, Zap, Layers } from 'lucide-react';
// import { useTheme } from '../components/Settings/themeUtils';

// const PageLayouts = () => {
//   const { theme, themeUtils } = useTheme();

//   const layouts = [
//     {
//       id: 1,
//       name: 'Default Dashboard',
//       description: 'Standard dashboard layout with sidebar and header',
//       icon: LayoutDashboard,
//       preview: 'sidebar'
//     },
//     {
//       id: 2,
//       name: 'Grid Layout',
//       description: 'Card-based grid layout for content display',
//       icon: Grid3x3,
//       preview: 'grid'
//     },
//     {
//       id: 3,
//       name: 'Minimal Layout',
//       description: 'Clean and simple layout with minimal elements',
//       icon: Square,
//       preview: 'minimal'
//     },
//     {
//       id: 4,
//       name: 'Compact Layout',
//       description: 'Space-efficient layout for dense information',
//       icon: Layers,
//       preview: 'compact'
//     },
//   ];

//   const responsiveSizes = [
//     { name: 'Desktop', icon: Monitor, size: '1920x1080' },
//     { name: 'Tablet', icon: Tablet, size: '768x1024' },
//     { name: 'Mobile', icon: Smartphone, size: '375x667' },
//   ];

//   return (
//     <div className="p-1">
//       <div className="mb-2">
//         <h1 className="text-lg font-bold  mb-0" style={{ color: themeUtils.getTextColor(true) }}>
//           Page Layouts
//         </h1>
//         <p style={{ color: themeUtils.getTextColor(false) }}>
//           Choose from various layout options to best suit your application needs and user preferences.
//         </p>
//       </div>

//       {/* Layout Options */}
//       <div className="mb-8">
//         <h2 className="text-xl font-semibold mb-6" style={{ color: themeUtils.getTextColor(true) }}>
//           Available Layouts
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {layouts.map((layout) => {
//             const Icon = layout.icon;
//             return (
//               <div
//                 key={layout.id}
//                 className="rounded-xl shadow-sm border p-6 hover:shadow-md transition-all duration-300 cursor-pointer group"
//                 style={{
//                   backgroundColor: themeUtils.getBgColor('card'),
//                   borderColor: themeUtils.getBorderColor()
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.transform = 'translateY(-2px)';
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.transform = 'translateY(0)';
//                 }}
//               >
//                 <div className="mb-4">
//                   <div
//                     className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
//                     style={{ backgroundColor: theme.headerBg ? `${theme.headerBg}20` : '#e0e7ff' }}
//                   >
//                     <Icon className="w-6 h-6" style={{ color: theme.headerBg || '#6366f1' }} />
//                   </div>
//                 </div>
//                 <h3 className="text-lg font-semibold mb-2" style={{ color: themeUtils.getTextColor(true) }}>
//                   {layout.name}
//                 </h3>
//                 <p className="text-sm mb-4" style={{ color: themeUtils.getTextColor(false) }}>
//                   {layout.description}
//                 </p>

//                 {/* Layout Preview */}
//                 <div className="h-24 rounded-lg border-2 border-dashed flex items-center justify-center"
//                      style={{ borderColor: theme.headerBg ? `${theme.headerBg}30` : '#c7d2fe' }}>
//                   {layout.preview === 'sidebar' && (
//                     <div className="w-full h-full flex gap-1 p-2">
//                       <div className="w-1/4 h-full rounded" style={{ backgroundColor: theme.headerBg ? `${theme.headerBg}40` : '#a5b4fc' }}></div>
//                       <div className="flex-1 h-full rounded" style={{ backgroundColor: theme.headerBg ? `${theme.headerBg}20` : '#e0e7ff' }}></div>
//                     </div>
//                   )}
//                   {layout.preview === 'grid' && (
//                     <div className="w-full h-full grid grid-cols-2 gap-1 p-2">
//                       <div className="rounded" style={{ backgroundColor: theme.headerBg ? `${theme.headerBg}40` : '#a5b4fc' }}></div>
//                       <div className="rounded" style={{ backgroundColor: theme.headerBg ? `${theme.headerBg}30` : '#c7d2fe' }}></div>
//                       <div className="rounded" style={{ backgroundColor: theme.headerBg ? `${theme.headerBg}30` : '#c7d2fe' }}></div>
//                       <div className="rounded" style={{ backgroundColor: theme.headerBg ? `${theme.headerBg}40` : '#a5b4fc' }}></div>
//                     </div>
//                   )}
//                   {layout.preview === 'minimal' && (
//                     <div className="w-full h-full p-2">
//                       <div className="w-full h-full rounded" style={{ backgroundColor: theme.headerBg ? `${theme.headerBg}20` : '#e0e7ff' }}></div>
//                     </div>
//                   )}
//                   {layout.preview === 'compact' && (
//                     <div className="w-full h-full flex gap-1 p-2">
//                       <div className="w-1/6 h-full rounded" style={{ backgroundColor: theme.headerBg ? `${theme.headerBg}40` : '#a5b4fc' }}></div>
//                       <div className="flex-1 h-full space-y-1">
//                         <div className="h-1/3 rounded" style={{ backgroundColor: theme.headerBg ? `${theme.headerBg}30` : '#c7d2fe' }}></div>
//                         <div className="h-1/3 rounded" style={{ backgroundColor: theme.headerBg ? `${theme.headerBg}30` : '#c7d2fe' }}></div>
//                         <div className="h-1/3 rounded" style={{ backgroundColor: theme.headerBg ? `${theme.headerBg}30` : '#c7d2fe' }}></div>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 <button
//                   className="w-full mt-4 py-2 rounded-lg font-medium transition-colors"
//                   style={{
//                     backgroundColor: theme.headerBg ? `${theme.headerBg}10` : '#e0e7ff',
//                     color: theme.headerBg || '#6366f1'
//                   }}
//                   onMouseEnter={(e) => {
//                     e.target.style.backgroundColor = theme.headerBg ? `${theme.headerBg}20` : '#c7d2fe';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.target.style.backgroundColor = theme.headerBg ? `${theme.headerBg}10` : '#e0e7ff';
//                   }}
//                 >
//                   Preview Layout
//                 </button>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Layout Components */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         <div className="rounded-xl shadow-sm border p-6"
//              style={{
//                backgroundColor: themeUtils.getBgColor('card'),
//                borderColor: themeUtils.getBorderColor()
//              }}>
//           <h2 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: themeUtils.getTextColor(true) }}>
//             <Columns className="w-5 h-5" style={{ color: theme.headerBg || '#6366f1' }} />
//             Layout Components
//           </h2>

//           <div className="space-y-4">
//             <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: theme.headerBg ? `${theme.headerBg}05` : 'transparent' }}>
//               <div className="flex items-center gap-3">
//                 <div
//                   className="w-8 h-8 rounded flex items-center justify-center"
//                   style={{ backgroundColor: theme.headerBg ? `${theme.headerBg}20` : '#e0e7ff' }}
//                 >
//                   <LayoutDashboard className="w-4 h-4" style={{ color: theme.headerBg || '#6366f1' }} />
//                 </div>
//                 <div>
//                   <h4 className="text-sm font-medium" style={{ color: themeUtils.getTextColor(true) }}>Header Component</h4>
//                   <p className="text-xs" style={{ color: themeUtils.getTextColor(false) }}>Navigation and user menu</p>
//                 </div>
//               </div>
//               <ChevronRight className="w-4 h-4" style={{ color: themeUtils.getTextColor(false) }} />
//             </div>

//             <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: theme.headerBg ? `${theme.headerBg}05` : 'transparent' }}>
//               <div className="flex items-center gap-3">
//                 <div
//                   className="w-8 h-8 rounded flex items-center justify-center"
//                   style={{ backgroundColor: '#d1fae5' }}
//                 >
//                   <Layers className="w-4 h-4" style={{ color: '#10b981' }} />
//                 </div>
//                 <div>
//                   <h4 className="text-sm font-medium" style={{ color: themeUtils.getTextColor(true) }}>Sidebar Component</h4>
//                   <p className="text-xs" style={{ color: themeUtils.getTextColor(false) }}>Main navigation menu</p>
//                 </div>
//               </div>
//               <ChevronRight className="w-4 h-4" style={{ color: themeUtils.getTextColor(false) }} />
//             </div>

//             <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: theme.headerBg ? `${theme.headerBg}05` : 'transparent' }}>
//               <div className="flex items-center gap-3">
//                 <div
//                   className="w-8 h-8 rounded flex items-center justify-center"
//                   style={{ backgroundColor: '#fef3c7' }}
//                 >
//                   <Square className="w-4 h-4" style={{ color: '#f59e0b' }} />
//                 </div>
//                 <div>
//                   <h4 className="text-sm font-medium" style={{ color: themeUtils.getTextColor(true) }}>Content Area</h4>
//                   <p className="text-xs" style={{ color: themeUtils.getTextColor(false) }}>Main content display</p>
//                 </div>
//               </div>
//               <ChevronRight className="w-4 h-4" style={{ color: themeUtils.getTextColor(false) }} />
//             </div>

//             <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: theme.headerBg ? `${theme.headerBg}05` : 'transparent' }}>
//               <div className="flex items-center gap-3">
//                 <div
//                   className="w-8 h-8 rounded flex items-center justify-center"
//                   style={{ backgroundColor: '#fee2e2' }}
//                 >
//                   <Grid3x3 className="w-4 h-4" style={{ color: '#ef4444' }} />
//                 </div>
//                 <div>
//                   <h4 className="text-sm font-medium" style={{ color: themeUtils.getTextColor(true) }}>Footer Component</h4>
//                   <p className="text-xs" style={{ color: themeUtils.getTextColor(false) }}>Page footer section</p>
//                 </div>
//               </div>
//               <ChevronRight className="w-4 h-4" style={{ color: themeUtils.getTextColor(false) }} />
//             </div>
//           </div>
//         </div>

//         <div className="rounded-xl shadow-sm border p-6"
//              style={{
//                backgroundColor: themeUtils.getBgColor('card'),
//                borderColor: themeUtils.getBorderColor()
//              }}>
//           <h2 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: themeUtils.getTextColor(true) }}>
//             <Zap className="w-5 h-5" style={{ color: theme.headerBg || '#6366f1' }} />
//             Layout Features
//           </h2>

//           <div className="space-y-4">
//             <div className="flex items-center gap-3">
//               <div
//                 className="w-10 h-10 rounded-lg flex items-center justify-center"
//                 style={{ backgroundColor: theme.headerBg ? `${theme.headerBg}20` : '#e0e7ff' }}
//               >
//                 <Eye className="w-5 h-5" style={{ color: theme.headerBg || '#6366f1' }} />
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium" style={{ color: themeUtils.getTextColor(true) }}>Responsive Design</h4>
//                 <p className="text-xs" style={{ color: themeUtils.getTextColor(false) }}>Adapts to all screen sizes</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <div
//                 className="w-10 h-10 rounded-lg flex items-center justify-center"
//                 style={{ backgroundColor: '#d1fae5' }}
//               >
//                 <Code className="w-5 h-5" style={{ color: '#10b981' }} />
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium" style={{ color: themeUtils.getTextColor(true) }}>Clean Code</h4>
//                 <p className="text-xs" style={{ color: themeUtils.getTextColor(false) }}>Well-structured and maintainable</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <div
//                 className="w-10 h-10 rounded-lg flex items-center justify-center"
//                 style={{ backgroundColor: '#fef3c7' }}
//               >
//                 <Layers className="w-5 h-5" style={{ color: '#f59e0b' }} />
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium" style={{ color: themeUtils.getTextColor(true) }}>Modular Structure</h4>
//                 <p className="text-xs" style={{ color: themeUtils.getTextColor(false) }}>Reusable components</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Responsive Preview */}
//       <div className="rounded-xl shadow-sm border p-6"
//            style={{
//              backgroundColor: themeUtils.getBgColor('card'),
//              borderColor: themeUtils.getBorderColor()
//            }}>
//         <h2 className="text-xl font-semibold mb-6" style={{ color: themeUtils.getTextColor(true) }}>
//           Responsive Preview
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {responsiveSizes.map((device, index) => {
//             const Icon = device.icon;
//             return (
//               <div key={index} className="text-center">
//                 <div
//                   className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-3"
//                   style={{ backgroundColor: theme.headerBg ? `${theme.headerBg}15` : '#e0e7ff' }}
//                 >
//                   <Icon className="w-8 h-8" style={{ color: theme.headerBg || '#6366f1' }} />
//                 </div>
//                 <h3 className="text-lg font-medium mb-1" style={{ color: themeUtils.getTextColor(true) }}>
//                   {device.name}
//                 </h3>
//                 <p className="text-sm" style={{ color: themeUtils.getTextColor(false) }}>
//                   {device.size}
//                 </p>

//                 {/* Device Preview */}
//                 <div className="mt-3 mx-auto rounded-lg border-2"
//                      style={{
//                        borderColor: theme.headerBg ? `${theme.headerBg}30` : '#c7d2fe',
//                        width: device.name === 'Desktop' ? '120px' : device.name === 'Tablet' ? '80px' : '40px',
//                        height: device.name === 'Desktop' ? '70px' : device.name === 'Tablet' ? '100px' : '70px'
//                      }}>
//                   <div className="w-full h-full p-1">
//                     <div className="w-full h-full rounded" style={{ backgroundColor: theme.headerBg ? `${theme.headerBg}20` : '#e0e7ff' }}></div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PageLayouts;

// import {
//   LayoutDashboard,
//   Grid3x3,
//   Square,
//   Layers,
//   Columns,
//   Zap,
//   Monitor,
//   Tablet,
//   Smartphone,
//   Eye,
//   Code,
// } from "lucide-react";

// import { useTheme } from "../components/Settings/themeUtils";

// // Import new components
// import LayoutCard from "../components/Layouts/LayoutCard";
// import ComponentItem from "../components/Layouts/ComponentItem";
// import FeatureItem from "../components/Layouts/FeatureItem";
// import DevicePreview from "../components/Layouts/DevicePreview";

// const PageLayouts = () => {
//   const { theme, themeUtils } = useTheme();

//   const layouts = [
//     {
//       id: 1,
//       name: "Default Dashboard",
//       description: "Standard dashboard layout with sidebar and header",
//       icon: LayoutDashboard,
//       preview: "sidebar",
//     },
//     {
//       id: 2,
//       name: "Grid Layout",
//       description: "Card-based grid layout for content display",
//       icon: Grid3x3,
//       preview: "grid",
//     },
//     {
//       id: 3,
//       name: "Minimal Layout",
//       description: "Clean and simple layout with minimal elements",
//       icon: Square,
//       preview: "minimal",
//     },
//     {
//       id: 4,
//       name: "Compact Layout",
//       description: "Space-efficient layout for dense information",
//       icon: Layers,
//       preview: "compact",
//     },
//   ];

//   const responsiveSizes = [
//     { name: "Desktop", icon: Monitor, size: "1920x1080" },
//     { name: "Tablet", icon: Tablet, size: "768x1024" },
//     { name: "Mobile", icon: Smartphone, size: "375x667" },
//   ];

//   const headerBg = theme.headerBg || "#6366f1";

//   return (
//     <div className="p-1">
//       <div className="mb-2">
//         <h1
//           className="text-lg font-bold mb-0"
//           style={{ color: themeUtils.getTextColor(true) }}
//         >
//           Page Layouts
//         </h1>
//         <p style={{ color: themeUtils.getTextColor(false) }}>
//           Choose from various layout options to best suit your application needs
//           and user preferences.
//         </p>
//       </div>

//       {/* Available Layouts */}
//       <div className="mb-8">
//         <h2
//           className="text-xl font-semibold mb-6"
//           style={{ color: themeUtils.getTextColor(true) }}
//         >
//           Available Layouts
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {layouts.map((layout) => (
//             <LayoutCard
//               key={layout.id}
//               layout={layout}
//               theme={theme}
//               themeUtils={themeUtils}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Layout Components & Features */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         {/* Layout Components */}
//         <div
//           className="rounded-xl shadow-sm border p-6"
//           style={{
//             backgroundColor: themeUtils.getBgColor("card"),
//             borderColor: themeUtils.getBorderColor(),
//           }}
//         >
//           <h2
//             className="text-xl font-semibold mb-6 flex items-center gap-2"
//             style={{ color: themeUtils.getTextColor(true) }}
//           >
//             <Columns className="w-5 h-5" style={{ color: headerBg }} />
//             Layout Components
//           </h2>
//           <div className="space-y-4">
//             <ComponentItem
//               icon={LayoutDashboard}
//               iconBg={`${headerBg}20`}
//               iconColor={headerBg}
//               title="Header Component"
//               description="Navigation and user menu"
//               theme={theme}
//               themeUtils={themeUtils}
//             />
//             <ComponentItem
//               icon={Layers}
//               iconBg="#d1fae5"
//               iconColor="#10b981"
//               title="Sidebar Component"
//               description="Main navigation menu"
//               theme={theme}
//               themeUtils={themeUtils}
//             />
//             <ComponentItem
//               icon={Square}
//               iconBg="#fef3c7"
//               iconColor="#f59e0b"
//               title="Content Area"
//               description="Main content display"
//               theme={theme}
//               themeUtils={themeUtils}
//             />
//             <ComponentItem
//               icon={Grid3x3}
//               iconBg="#fee2e2"
//               iconColor="#ef4444"
//               title="Footer Component"
//               description="Page footer section"
//               theme={theme}
//               themeUtils={themeUtils}
//             />
//           </div>
//         </div>

//         {/* Layout Features */}
//         <div
//           className="rounded-xl shadow-sm border p-6"
//           style={{
//             backgroundColor: themeUtils.getBgColor("card"),
//             borderColor: themeUtils.getBorderColor(),
//           }}
//         >
//           <h2
//             className="text-xl font-semibold mb-6 flex items-center gap-2"
//             style={{ color: themeUtils.getTextColor(true) }}
//           >
//             <Zap className="w-5 h-5" style={{ color: headerBg }} />
//             Layout Features
//           </h2>
//           <div className="space-y-4">
//             <FeatureItem
//               icon={Eye}
//               iconBg={`${headerBg}20`}
//               iconColor={headerBg}
//               title="Responsive Design"
//               description="Adapts to all screen sizes"
//               themeUtils={themeUtils}
//             />
//             <FeatureItem
//               icon={Code}
//               iconBg="#d1fae5"
//               iconColor="#10b981"
//               title="Clean Code"
//               description="Well-structured and maintainable"
//               themeUtils={themeUtils}
//             />
//             <FeatureItem
//               icon={Layers}
//               iconBg="#fef3c7"
//               iconColor="#f59e0b"
//               title="Modular Structure"
//               description="Reusable components"
//               themeUtils={themeUtils}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Responsive Preview */}
//       <div
//         className="rounded-xl shadow-sm border p-6"
//         style={{
//           backgroundColor: themeUtils.getBgColor("card"),
//           borderColor: themeUtils.getBorderColor(),
//         }}
//       >
//         <h2
//           className="text-xl font-semibold mb-6"
//           style={{ color: themeUtils.getTextColor(true) }}
//         >
//           Responsive Preview
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {responsiveSizes.map((device, index) => (
//             <DevicePreview key={index} device={device} theme={theme} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PageLayouts;
