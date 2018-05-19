#import <Cocoa/Cocoa.h>

@interface RenameStyles : NSObject

// View bindings go here
@property IBOutlet NSWindow *window;
@property IBOutlet NSScrollView *scrollView;
@property IBOutlet NSTextField *beforeLabel;
@property IBOutlet NSTextField *afterLabel;
@property IBOutlet NSTextField *versionLabel;
// End of view bindings

// Control action handlers go here
- (IBAction)handleRename:(id)sender;
- (IBAction)handleApply:(id)sender;
- (IBAction)handleCancel:(id)sender;
- (IBAction)toggleShowOnlyMatchingStyles:(id)sender;
- (IBAction)toggleAutoscroll:(id)sender;
- (IBAction)toggleFindOption:(id)sender;
// End of actions

@end

@implementation RenameStylesOwner
@end
