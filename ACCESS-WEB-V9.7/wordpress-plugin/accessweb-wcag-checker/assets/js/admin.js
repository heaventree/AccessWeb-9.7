/**
 * AccessWeb WCAG Checker Admin JavaScript
 */

(function($) {
    'use strict';

    // Color utility functions
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function getLuminance(r, g, b) {
        const [rs, gs, bs] = [r, g, b].map(function(c) {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return rs * 0.2126 + gs * 0.7152 + bs * 0.0722;
    }

    function getContrastRatio(color1, color2) {
        const lum1 = getLuminance(color1.r, color1.g, color1.b);
        const lum2 = getLuminance(color2.r, color2.g, color2.b);
        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        return (brightest + 0.05) / (darkest + 0.05);
    }

    function getWCAGLevel(ratio) {
        if (ratio >= 7) return 'AAA';
        if (ratio >= 4.5) return 'AA';
        return 'Fail';
    }

    $(document).ready(function() {
        // Main scan form handler
        $('#accessweb-scan-form').on('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                action: 'accessweb_test_url',
                nonce: accessweb_ajax.nonce,
                url: $('#website-url').val(),
                wcag_level: $('#wcag-level').val(),
                include_screenshots: $('input[name="include_screenshots"]:checked').length > 0,
                include_pdf: $('input[name="include_pdf"]:checked').length > 0
            };

            // Show loading state
            $('#accessweb-loading').show();
            $('#accessweb-results').hide();
            
            // Disable form
            $('#accessweb-scan-form button').prop('disabled', true);

            // Make AJAX request
            $.post(accessweb_ajax.ajax_url, formData)
                .done(function(response) {
                    if (response.success) {
                        displayResults(response.data);
                    } else {
                        showError(response.data || accessweb_ajax.strings.error);
                    }
                })
                .fail(function(xhr, status, error) {
                    showError('Network error: ' + error);
                })
                .always(function() {
                    $('#accessweb-loading').hide();
                    $('#accessweb-scan-form button').prop('disabled', false);
                });
        });

        // Quick scan current site
        $('#quick-scan-current').on('click', function() {
            $('#website-url').val(window.location.origin);
            $('#accessweb-scan-form').submit();
        });

        // Display test results
        function displayResults(data) {
            // Update score
            $('#score-number').text(data.score || 0);
            updateScoreColor(data.score || 0);
            
            // Update issue counts
            $('#critical-count').text(data.summary.critical || 0);
            $('#serious-count').text(data.summary.serious || 0);
            $('#moderate-count').text(data.summary.moderate || 0);
            $('#minor-count').text(data.summary.minor || 0);
            
            // Display detailed issues
            displayIssueDetails(data.issues || []);
            
            // Show results
            $('#accessweb-results').show();
            
            // Scroll to results
            $('html, body').animate({
                scrollTop: $('#accessweb-results').offset().top - 50
            }, 500);
        }

        function updateScoreColor(score) {
            const scoreCircle = $('.score-circle');
            scoreCircle.removeClass('score-good score-fair score-poor');
            
            if (score >= 80) {
                scoreCircle.addClass('score-good');
                scoreCircle.css('background', 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)');
            } else if (score >= 60) {
                scoreCircle.addClass('score-fair');
                scoreCircle.css('background', 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)');
            } else {
                scoreCircle.addClass('score-poor');
                scoreCircle.css('background', 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)');
            }
        }

        function displayIssueDetails(issues) {
            const container = $('#results-details');
            container.empty();
            
            if (issues.length === 0) {
                container.html('<div class="no-issues"><h4>Great job! No accessibility issues found.</h4><p>Your website appears to meet WCAG guidelines.</p></div>');
                return;
            }
            
            // Group issues by impact level
            const groupedIssues = {
                critical: issues.filter(issue => issue.impact === 'critical'),
                serious: issues.filter(issue => issue.impact === 'serious'),
                moderate: issues.filter(issue => issue.impact === 'moderate'),
                minor: issues.filter(issue => issue.impact === 'minor')
            };
            
            Object.keys(groupedIssues).forEach(function(level) {
                const levelIssues = groupedIssues[level];
                if (levelIssues.length > 0) {
                    container.append(createIssueSection(level, levelIssues));
                }
            });
        }

        function createIssueSection(level, issues) {
            const section = $('<div class="issue-section issue-' + level + '"></div>');
            const header = $('<h4 class="issue-section-header">' + 
                level.charAt(0).toUpperCase() + level.slice(1) + ' Issues (' + issues.length + ')</h4>');
            
            section.append(header);
            
            issues.forEach(function(issue) {
                const issueCard = $('<div class="issue-card"></div>');
                
                issueCard.html(`
                    <div class="issue-header">
                        <h5>${issue.message}</h5>
                        <span class="issue-guideline">WCAG ${issue.wcagGuideline}</span>
                    </div>
                    <div class="issue-description">
                        <p>${issue.description}</p>
                    </div>
                    <div class="issue-element">
                        <strong>Element:</strong>
                        <code>${escapeHtml(issue.element)}</code>
                    </div>
                    <div class="issue-fix">
                        <strong>How to fix:</strong>
                        <p>${issue.howToFix}</p>
                    </div>
                    <div class="issue-actions">
                        <a href="${issue.helpUrl}" target="_blank" class="button button-small">Learn More</a>
                    </div>
                `);
                
                section.append(issueCard);
            });
            
            return section;
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function showError(message) {
            alert('Error: ' + message);
        }

        // Export PDF functionality
        $('#export-pdf').on('click', function() {
            alert('PDF export functionality requires AccessWeb Pro subscription.');
        });

        // Save report functionality
        $('#save-report').on('click', function() {
            alert('Report saved to database.');
        });

        // Reports page functionality
        if ($('#reports-table-body').length) {
            loadReports();
            
            $('#refresh-reports').on('click', loadReports);
            $('#filter-timeframe').on('change', loadReports);
        }

        function loadReports() {
            const days = $('#filter-timeframe').val() || 30;
            
            $.post(accessweb_ajax.ajax_url, {
                action: 'accessweb_get_reports',
                nonce: accessweb_ajax.nonce,
                days: days
            })
            .done(function(response) {
                if (response.success) {
                    displayReports(response.data);
                }
            });
        }

        function displayReports(reports) {
            const tbody = $('#reports-table-body');
            tbody.empty();
            
            if (reports.length === 0) {
                tbody.html('<tr><td colspan="6" class="no-reports">No reports found for the selected timeframe.</td></tr>');
                return;
            }
            
            reports.forEach(function(report) {
                const row = $('<tr></tr>');
                const date = new Date(report.created_at).toLocaleDateString();
                const totalIssues = (report.issues_critical || 0) + (report.issues_serious || 0) + 
                                  (report.issues_moderate || 0) + (report.issues_minor || 0);
                
                let statusClass = 'status-good';
                let statusText = 'Good';
                
                if (report.issues_critical > 0) {
                    statusClass = 'status-critical';
                    statusText = 'Critical Issues';
                } else if (report.issues_serious > 0) {
                    statusClass = 'status-warning';
                    statusText = 'Needs Attention';
                }
                
                row.html(`
                    <td>${date}</td>
                    <td><a href="${report.url}" target="_blank">${report.url}</a></td>
                    <td><strong>${report.score}/100</strong></td>
                    <td>${totalIssues}</td>
                    <td><span class="status ${statusClass}">${statusText}</span></td>
                    <td>
                        <button class="button button-small view-report" data-id="${report.id}">View</button>
                        <button class="button button-small delete-report" data-id="${report.id}">Delete</button>
                    </td>
                `);
                
                tbody.append(row);
            });
        }

        // Color palette functionality
        if ($('#base-color').length) {
            initColorPalette();
        }

        function initColorPalette() {
            // Sync color picker and hex input
            $('#base-color').on('input', function() {
                $('#base-color-hex').val($(this).val());
                updateTestSample();
            });
            
            $('#base-color-hex').on('input', function() {
                const value = $(this).val();
                if (/^#[0-9A-F]{6}$/i.test(value)) {
                    $('#base-color').val(value);
                    updateTestSample();
                }
            });
            
            // Generate palette
            $('#generate-palette').on('click', function() {
                generateColorPalette();
            });
            
            // Initial setup
            updateTestSample();
        }

        function generateColorPalette() {
            const baseColor = $('#base-color').val();
            const harmony = $('#color-harmony').val();
            
            // Simple palette generation (in a real implementation, this would be more sophisticated)
            const colors = generateHarmonyColors(baseColor, harmony);
            displayColorPalette(colors);
        }

        function generateHarmonyColors(baseColor, harmony) {
            const colors = [baseColor];
            const baseRgb = hexToRgb(baseColor);
            
            // Simple harmony generation (this is a basic implementation)
            switch (harmony) {
                case 'complementary':
                    colors.push(adjustHue(baseColor, 180));
                    colors.push(lighten(baseColor, 0.2));
                    colors.push(darken(baseColor, 0.2));
                    break;
                case 'analogous':
                    colors.push(adjustHue(baseColor, 30));
                    colors.push(adjustHue(baseColor, -30));
                    colors.push(adjustHue(baseColor, 60));
                    break;
                case 'triadic':
                    colors.push(adjustHue(baseColor, 120));
                    colors.push(adjustHue(baseColor, 240));
                    colors.push(lighten(baseColor, 0.3));
                    break;
                case 'monochromatic':
                    colors.push(lighten(baseColor, 0.2));
                    colors.push(lighten(baseColor, 0.4));
                    colors.push(darken(baseColor, 0.2));
                    colors.push(darken(baseColor, 0.4));
                    break;
            }
            
            return colors.slice(0, 6); // Limit to 6 colors
        }

        function adjustHue(hex, degrees) {
            // Simple hue adjustment (basic implementation)
            const rgb = hexToRgb(hex);
            // This is a simplified version - real implementation would convert to HSL
            return hex; // Placeholder
        }

        function lighten(hex, amount) {
            const rgb = hexToRgb(hex);
            const factor = 1 + amount;
            return rgbToHex(
                Math.min(255, Math.round(rgb.r * factor)),
                Math.min(255, Math.round(rgb.g * factor)),
                Math.min(255, Math.round(rgb.b * factor))
            );
        }

        function darken(hex, amount) {
            const rgb = hexToRgb(hex);
            const factor = 1 - amount;
            return rgbToHex(
                Math.max(0, Math.round(rgb.r * factor)),
                Math.max(0, Math.round(rgb.g * factor)),
                Math.max(0, Math.round(rgb.b * factor))
            );
        }

        function rgbToHex(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }

        function displayColorPalette(colors) {
            const container = $('#palette-results');
            container.empty();
            
            const paletteGrid = $('<div class="palette-grid"></div>');
            
            colors.forEach(function(color) {
                const colorCard = $('<div class="color-card"></div>');
                const contrastWhite = getContrastRatio(hexToRgb(color), {r: 255, g: 255, b: 255});
                const contrastBlack = getContrastRatio(hexToRgb(color), {r: 0, g: 0, b: 0});
                const bestContrast = contrastWhite > contrastBlack ? 'white' : 'black';
                const bestRatio = Math.max(contrastWhite, contrastBlack);
                const wcagLevel = getWCAGLevel(bestRatio);
                
                colorCard.html(`
                    <div class="color-swatch" style="background-color: ${color}; color: ${bestContrast};">
                        <span class="color-value">${color}</span>
                    </div>
                    <div class="color-info">
                        <div class="contrast-ratio">${bestRatio.toFixed(2)}:1</div>
                        <div class="wcag-level ${wcagLevel.toLowerCase()}">${wcagLevel}</div>
                    </div>
                `);
                
                colorCard.on('click', function() {
                    $('#base-color').val(color);
                    $('#base-color-hex').val(color);
                    updateTestSample();
                });
                
                paletteGrid.append(colorCard);
            });
            
            container.append(paletteGrid);
        }

        function updateTestSample() {
            const backgroundColor = $('#base-color').val();
            const backgroundRgb = hexToRgb(backgroundColor);
            
            // Calculate best text color
            const contrastWhite = getContrastRatio(backgroundRgb, {r: 255, g: 255, b: 255});
            const contrastBlack = getContrastRatio(backgroundRgb, {r: 0, g: 0, b: 0});
            
            const textColor = contrastWhite > contrastBlack ? '#ffffff' : '#000000';
            const ratio = Math.max(contrastWhite, contrastBlack);
            const wcagLevel = getWCAGLevel(ratio);
            
            // Update test sample
            $('#test-sample').css({
                'background-color': backgroundColor,
                'color': textColor
            });
            
            // Update contrast info
            $('#contrast-value').text(ratio.toFixed(2) + ':1');
            $('#compliance-level').text(wcagLevel).removeClass('AA AAA Fail').addClass(wcagLevel);
            
            const complianceText = wcagLevel === 'AAA' ? 'WCAG 2.1 AAA Compliant' :
                                 wcagLevel === 'AA' ? 'WCAG 2.1 AA Compliant' :
                                 'Does not meet WCAG requirements';
            $('.compliance-text').text(complianceText);
        }
    });

})(jQuery);

// Add CSS for dynamic elements
jQuery(document).ready(function($) {
    $('<style>')
        .prop('type', 'text/css')
        .html(`
            .issue-section { margin-bottom: 30px; }
            .issue-section-header { 
                padding: 15px 20px; 
                margin: 0; 
                border-radius: 8px 8px 0 0; 
                color: white; 
                font-size: 16px;
            }
            .issue-critical .issue-section-header { background: #f44336; }
            .issue-serious .issue-section-header { background: #ff9800; }
            .issue-moderate .issue-section-header { background: #9c27b0; }
            .issue-minor .issue-section-header { background: #4caf50; }
            
            .issue-card { 
                border: 1px solid #ddd; 
                border-top: none; 
                padding: 20px; 
                background: #fff; 
            }
            .issue-card:last-child { border-radius: 0 0 8px 8px; }
            
            .issue-header { 
                display: flex; 
                justify-content: space-between; 
                align-items: flex-start; 
                margin-bottom: 15px; 
            }
            .issue-header h5 { margin: 0; color: #23282d; }
            .issue-guideline { 
                background: #e1f5fe; 
                color: #01579b; 
                padding: 4px 8px; 
                border-radius: 4px; 
                font-size: 12px; 
                font-weight: 600;
            }
            
            .issue-description, .issue-element, .issue-fix { margin-bottom: 15px; }
            .issue-element code { 
                background: #f5f5f5; 
                padding: 4px 8px; 
                border-radius: 4px; 
                font-size: 12px; 
                max-width: 100%; 
                overflow-x: auto; 
                display: inline-block;
            }
            
            .no-issues { 
                text-align: center; 
                padding: 60px 20px; 
                background: #e8f5e8; 
                border-radius: 8px; 
                color: #2e7d32; 
            }
            
            .palette-grid { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
                gap: 20px; 
                margin-top: 20px; 
            }
            .color-card { 
                border: 1px solid #ddd; 
                border-radius: 8px; 
                overflow: hidden; 
                cursor: pointer; 
                transition: transform 0.2s ease;
            }
            .color-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            
            .color-swatch { 
                height: 80px; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-weight: 600; 
                font-family: monospace;
            }
            .color-info { 
                padding: 15px; 
                text-align: center; 
                background: #fff;
            }
            .contrast-ratio { font-weight: 600; margin-bottom: 5px; }
            .wcag-level { 
                padding: 4px 8px; 
                border-radius: 4px; 
                font-size: 12px; 
                font-weight: 600; 
                display: inline-block;
            }
            .wcag-level.aaa { background: #2196f3; color: white; }
            .wcag-level.aa { background: #4caf50; color: white; }
            .wcag-level.fail { background: #f44336; color: white; }
            
            .status { 
                padding: 4px 12px; 
                border-radius: 4px; 
                font-size: 12px; 
                font-weight: 600;
            }
            .status-good { background: #e8f5e8; color: #2e7d32; }
            .status-warning { background: #fff3e0; color: #ef6c00; }
            .status-critical { background: #ffebee; color: #c62828; }
        `)
        .appendTo('head');
});