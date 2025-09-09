import React, { ReactNode, cloneElement, Children, isValidElement } from "react";

interface MarqueeProps {
  variant: 'Slow' | 'Medium' | 'Fast';
  slot?: ReactNode; 
}

export const Marquee = ({ variant, slot }: MarqueeProps) => {
  const getAnimationDuration = () => {
    switch (variant.toLowerCase()) {
      case 'slow': return '25s';
      case 'fast': return '8s';
      default: return '15s';
    }
  };

  const containerStyle: React.CSSProperties = {
    width: 'var(--marquee-width, 100%)',
    height: 'var(--marquee-height, 80px)',
    overflow: 'hidden',
    position: 'relative',
    background: 'transparent'
  } as React.CSSProperties;

  const trackStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    animation: `scroll-seamless ${getAnimationDuration()} linear infinite`,
    willChange: 'transform'
  };

  // Process children - only add spacing, no styling
  const processChildren = (children: ReactNode): ReactNode => {
    // Handle React Fragments - flatten them first
    const flattenChildren = (node: ReactNode): ReactNode[] => {
      const result: ReactNode[] = [];
      
      Children.forEach(node, (child) => {
        if (isValidElement(child) && child.type === React.Fragment) {
          result.push(...flattenChildren(child.props.children));
        } else {
          result.push(child);
        }
      });
      
      return result;
    };

    const flatChildren = flattenChildren(children);
    
    return flatChildren.map((child, index) => {
      if (isValidElement(child)) {
        // Every item gets the gap except we'll handle this differently
        return cloneElement(child, {
          ...child.props,
          key: `item-${index}`,
          style: { 
            ...child.props.style,
            marginRight: 'var(--marquee-gap, 38px)',
            flexShrink: 0
          } as React.CSSProperties
        });
      }
      return child;
    });
  };

  const processedChildren = processChildren(slot);

  // Create enough copies to fill the container and ensure seamless scrolling
  // We'll create multiple copies in one continuous track
  const createContinuousContent = () => {
    const copies = [];
    // Create enough copies to ensure seamless scrolling (usually 3-4 is enough)
    for (let i = 0; i < 4; i++) {
      copies.push(
        <React.Fragment key={`copy-${i}`}>
          {processedChildren}
        </React.Fragment>
      );
    }
    return copies;
  };

  return (
    <>
      <style>
        {`
          @keyframes scroll-seamless {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-25%);
            }
          }
        `}
      </style>
      <div style={containerStyle}>
        <div style={trackStyle}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0
          }}>
            {createContinuousContent()}
          </div>
        </div>
      </div>
    </>
  );
};