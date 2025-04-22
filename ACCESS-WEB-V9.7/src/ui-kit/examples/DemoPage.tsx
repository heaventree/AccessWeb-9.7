/**
 * ACCESS-WEB UI Kit - Demo Page Example
 * 
 * This example demonstrates how to use various UI Kit components together
 * to create a cohesive page layout.
 */

import React from 'react';
import { PageLayout, PageHeader } from '../layouts/PageLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardFeatureIcon } from '../components/Card';
import { Button, ButtonGroup } from '../components/Button';
import { Container, Section } from '../components/Container';
import { colors } from '../tokens/colors';

// Mock icons for the example
const AccessibilityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4l2 2" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export function DemoPage() {
  return (
    <PageLayout
      header={
        <PageHeader
          title="UI Kit Components Demo"
          description="This page demonstrates the various components in the UI Kit"
          background="brand"
          actions={
            <Button 
              variant={{ shape: 'pill' }}
              icon={<ArrowRightIcon />}
              iconPosition="right"
            >
              View Documentation
            </Button>
          }
        />
      }
    >
      <Section background="none" spacing="lg">
        <Container>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Button Examples</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Button Variants</CardTitle>
                <CardDescription>Different button styles for different purposes</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Button variant={{ variant: 'primary' }}>Primary</Button>
                <Button variant={{ variant: 'secondary' }}>Secondary</Button>
                <Button variant={{ variant: 'outline' }}>Outline</Button>
                <Button variant={{ variant: 'ghost' }}>Ghost</Button>
                <Button variant={{ variant: 'link' }}>Link</Button>
                <Button variant={{ variant: 'danger' }}>Danger</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Button Shapes</CardTitle>
                <CardDescription>Different button shapes for different designs</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Button variant={{ shape: 'square' }}>Square</Button>
                <Button variant={{ shape: 'rounded' }}>Rounded</Button>
                <Button variant={{ shape: 'pill' }}>Pill</Button>
              </CardContent>
            </Card>
          </div>
          
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Card Examples</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card hoverable>
              <CardHeader>
                <CardFeatureIcon 
                  icon={AccessibilityIcon}
                  background="primary"
                  size="md"
                  rounded="md"
                />
                <CardTitle>Accessibility Checker</CardTitle>
                <CardDescription>Check your site against WCAG 2.1 guidelines</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Our automated tools can help identify accessibility issues before they impact your users.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant={{ variant: 'primary', width: 'full' }}
                  icon={<CheckIcon />}
                  iconPosition="left"
                >
                  Run Check
                </Button>
              </CardFooter>
            </Card>
            
            <Card variant={{ variant: 'secondary' }} hoverable>
              <CardHeader>
                <CardFeatureIcon 
                  icon={AccessibilityIcon}
                  background="secondary"
                  size="md"
                  rounded="md"
                />
                <CardTitle>Color Contrast</CardTitle>
                <CardDescription>Ensure your colors meet WCAG requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Test color combinations to ensure they meet accessibility standards for all users.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant={{ variant: 'outline', width: 'full' }}
                >
                  Test Colors
                </Button>
              </CardFooter>
            </Card>
            
            <Card variant={{ variant: 'outline' }} hoverable>
              <CardHeader>
                <CardFeatureIcon 
                  icon={AccessibilityIcon}
                  background="primary"
                  size="md"
                  rounded="full"
                />
                <CardTitle>Keyboard Navigation</CardTitle>
                <CardDescription>Test keyboard accessibility</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Ensure your site can be navigated using only a keyboard for users with mobility impairments.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant={{ variant: 'ghost', width: 'full' }}
                >
                  Start Test
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Container Examples</h2>
          
          <div className="space-y-8 mb-12">
            <Container 
              variant={{ size: 'md' }}
              background="light"
              horizontalPadding="md"
              verticalPadding="md"
              className="rounded-lg"
            >
              <h3 className="text-lg font-semibold mb-2">Medium Container with Light Background</h3>
              <p>This container has a maximum width constraint and light background.</p>
            </Container>
            
            <Container 
              variant={{ size: 'lg' }}
              background="brand"
              horizontalPadding="lg"
              verticalPadding="md"
              className="rounded-lg"
            >
              <h3 className="text-lg font-semibold mb-2">Large Container with Brand Background</h3>
              <p>This container uses the brand color as a subtle background.</p>
            </Container>
          </div>
          
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Button Group Example</h2>
          
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Button Groups</CardTitle>
              <CardDescription>Group related buttons together</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-md font-medium mb-2">Horizontal Group</h3>
                <ButtonGroup>
                  <Button variant={{ variant: 'primary' }}>Save</Button>
                  <Button variant={{ variant: 'outline' }}>Cancel</Button>
                  <Button variant={{ variant: 'secondary' }}>Preview</Button>
                </ButtonGroup>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-2">Vertical Group</h3>
                <ButtonGroup orientation="vertical">
                  <Button variant={{ variant: 'primary', width: 'full' }}>Save</Button>
                  <Button variant={{ variant: 'outline', width: 'full' }}>Cancel</Button>
                  <Button variant={{ variant: 'secondary', width: 'full' }}>Preview</Button>
                </ButtonGroup>
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Design Tokens</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">Brand Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Object.entries(colors.primary).filter(([key]) => !['gradient', 'DEFAULT'].includes(key)).map(([name, color]) => (
                  <div key={name} className="flex flex-col items-center">
                    <div 
                      className="w-16 h-16 rounded-md mb-2" 
                      style={{ backgroundColor: typeof color === 'string' ? color : '' }}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">primary.{name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">Semantic Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries({
                  success: colors.success.DEFAULT,
                  warning: colors.warning.DEFAULT,
                  error: colors.error.DEFAULT,
                  info: colors.info.DEFAULT
                }).map(([name, color]) => (
                  <div key={name} className="flex flex-col items-center">
                    <div 
                      className="w-16 h-16 rounded-md mb-2" 
                      style={{ backgroundColor: typeof color === 'string' ? color : '' }}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </PageLayout>
  );
}

export default DemoPage;